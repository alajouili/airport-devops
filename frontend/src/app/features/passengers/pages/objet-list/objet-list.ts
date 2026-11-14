import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CATEGORIE_OBJET_LABELS,
  CategorieObjet,
  ObjetTrouve,
  STATUT_OBJET_BADGES,
  STATUT_OBJET_LABELS,
  StatutObjet,
} from '../../models/objet-trouve.model';
import { ObjetTrouveService } from '../../services/objet-trouve.service';

/** Lost-and-found register, with a form to declare a newly found object. */
@Component({
  selector: 'app-objet-list',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './objet-list.html',
})
export class ObjetList implements OnInit {
  private readonly objetService = inject(ObjetTrouveService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly objets = signal<ObjetTrouve[]>([]);
  protected readonly loading = signal(true);
  protected readonly showForm = signal(false);
  protected readonly saving = signal(false);

  protected statut: StatutObjet | null = 'EN_STOCK';
  protected categorie: CategorieObjet | null = null;
  protected recherche = '';

  protected readonly statutLabels = STATUT_OBJET_LABELS;
  protected readonly statutBadges = STATUT_OBJET_BADGES;
  protected readonly statuts = Object.keys(STATUT_OBJET_LABELS) as StatutObjet[];
  protected readonly categorieLabels = CATEGORIE_OBJET_LABELS;
  protected readonly categories = Object.keys(CATEGORIE_OBJET_LABELS) as CategorieObjet[];

  protected readonly form = this.fb.nonNullable.group({
    description: ['', [Validators.required, Validators.maxLength(255)]],
    categorie: this.fb.nonNullable.control<CategorieObjet>('AUTRE'),
    lieuTrouve: ['', [Validators.required, Validators.maxLength(100)]],
    dateTrouve: [maintenantLocal(), Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.objetService.getAll(this.statut, this.categorie, this.recherche).subscribe({
      next: (list) => {
        this.objets.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected declarer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.objetService.create(this.form.getRawValue()).subscribe({
      next: (objet) => {
        this.toast.success(`Objet ${objet.reference} enregistré`);
        this.form.reset({ description: '', categorie: 'AUTRE', lieuTrouve: '', dateTrouve: maintenantLocal() });
        this.showForm.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }
}

/** Current local date-time in the format of <input type="datetime-local">: "2026-10-29T14:30". */
function maintenantLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().substring(0, 16);
}
