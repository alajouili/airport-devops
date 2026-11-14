import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CATEGORIE_OBJET_LABELS,
  ObjetTrouveDetail,
  STATUT_OBJET_BADGES,
  STATUT_OBJET_LABELS,
  STATUT_RESTITUTION_BADGES,
  STATUT_RESTITUTION_LABELS,
} from '../../models/objet-trouve.model';
import { ObjetTrouveService } from '../../services/objet-trouve.service';

/** One found object: its claims, the decision on each claim, and elimination. */
@Component({
  selector: 'app-objet-detail',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './objet-detail.html',
})
export class ObjetDetailPage implements OnInit {
  private readonly objetService = inject(ObjetTrouveService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly id = input.required<string>();

  protected readonly detail = signal<ObjetTrouveDetail | null>(null);
  protected readonly busy = signal(false);
  /** Refusal reason typed for each claim, keyed by claim id. */
  protected motifs: Record<number, string> = {};

  protected readonly statutLabels = STATUT_OBJET_LABELS;
  protected readonly statutBadges = STATUT_OBJET_BADGES;
  protected readonly categorieLabels = CATEGORIE_OBJET_LABELS;
  protected readonly demandeLabels = STATUT_RESTITUTION_LABELS;
  protected readonly demandeBadges = STATUT_RESTITUTION_BADGES;

  protected readonly form = this.fb.nonNullable.group({
    nomDemandeur: ['', [Validators.required, Validators.maxLength(160)]],
    contact: ['', [Validators.required, Validators.maxLength(150)]],
    descriptionPreuve: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.objetService.getDetail(Number(this.id())).subscribe((d) => this.detail.set(d));
  }

  protected ajouterDemande(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.objetService.ajouterDemande(Number(this.id()), { ...this.form.getRawValue(), passagerId: null }).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.form.reset();
        this.toast.success('Demande de restitution enregistrée');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  protected decider(demandeId: number, acceptee: boolean): void {
    const motif = this.motifs[demandeId] ?? '';
    if (!acceptee && !motif.trim()) {
      this.toast.error('Indiquez le motif du refus');
      return;
    }
    this.busy.set(true);
    this.objetService.decider(demandeId, acceptee, motif).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.toast.success(acceptee ? 'Objet restitué' : 'Demande refusée');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  protected eliminer(): void {
    if (!confirm('Éliminer cet objet (don ou destruction) ? Cette action est définitive.')) {
      return;
    }
    this.busy.set(true);
    this.objetService.eliminer(Number(this.id())).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.toast.info('Objet éliminé');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }
}
