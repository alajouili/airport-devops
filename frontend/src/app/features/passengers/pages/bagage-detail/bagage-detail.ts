import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  BagageDetail,
  STATUT_BAGAGE_BADGES,
  STATUT_BAGAGE_LABELS,
  TYPE_EVENEMENT_LABELS,
  TypeEvenementBagage,
} from '../../models/bagage.model';
import { BagageService } from '../../services/bagage.service';

/**
 * Tracking of one bag: its status history (timeline) and handling events,
 * plus a form to record a new event (scan). The server refuses impossible
 * transitions (for example LIVRE -> CHARGE) with an HTTP 409.
 */
@Component({
  selector: 'app-bagage-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './bagage-detail.html',
  styleUrl: './bagage-detail.css',
})
export class BagageDetailPage implements OnInit {
  private readonly bagageService = inject(BagageService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly id = input.required<string>();

  protected readonly detail = signal<BagageDetail | null>(null);
  protected readonly saving = signal(false);

  protected readonly statutLabels = STATUT_BAGAGE_LABELS;
  protected readonly statutBadges = STATUT_BAGAGE_BADGES;
  protected readonly evenementLabels = TYPE_EVENEMENT_LABELS;
  protected readonly typesEvenement = Object.keys(TYPE_EVENEMENT_LABELS) as TypeEvenementBagage[];

  protected readonly form = this.fb.nonNullable.group({
    typeEvenement: this.fb.nonNullable.control<TypeEvenementBagage>('SCAN_TRI', Validators.required),
    lieu: ['', [Validators.required, Validators.maxLength(100)]],
    commentaire: ['', Validators.maxLength(255)],
  });

  ngOnInit(): void {
    this.bagageService.getDetail(Number(this.id())).subscribe((d) => this.detail.set(d));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.bagageService.ajouterEvenement(Number(this.id()), this.form.getRawValue()).subscribe({
      next: (detail) => {
        // The server returns the updated detail: no need for a second request.
        this.detail.set(detail);
        this.toast.success('Événement enregistré');
        this.form.patchValue({ lieu: '', commentaire: '' });
        this.form.markAsUntouched();
        this.saving.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
