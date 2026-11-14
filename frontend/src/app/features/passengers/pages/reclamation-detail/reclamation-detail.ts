import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ToastService } from '../../../../core/services/toast.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CATEGORIE_RECLAMATION_LABELS,
  Reclamation,
  STATUT_RECLAMATION_BADGES,
  STATUT_RECLAMATION_LABELS,
  StatutReclamation,
  TRANSITIONS_RECLAMATION,
} from '../../models/reclamation.model';
import { ReclamationService } from '../../services/reclamation.service';

/** Processing of one complaint: only the next allowed statuses are proposed. */
@Component({
  selector: 'app-reclamation-detail',
  imports: [FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './reclamation-detail.html',
})
export class ReclamationDetailPage implements OnInit {
  private readonly reclamationService = inject(ReclamationService);
  private readonly toast = inject(ToastService);

  readonly id = input.required<string>();

  protected readonly reclamation = signal<Reclamation | null>(null);
  protected readonly busy = signal(false);
  protected reponse = '';

  protected readonly statutLabels = STATUT_RECLAMATION_LABELS;
  protected readonly statutBadges = STATUT_RECLAMATION_BADGES;
  protected readonly categorieLabels = CATEGORIE_RECLAMATION_LABELS;
  protected readonly transitions = TRANSITIONS_RECLAMATION;

  ngOnInit(): void {
    this.reclamationService.getById(Number(this.id())).subscribe((r) => {
      this.reclamation.set(r);
      this.reponse = r.reponse ?? '';
    });
  }

  /** RESOLUE and REJETEE close the complaint and need an answer. */
  protected isFinal(statut: StatutReclamation): boolean {
    return statut === 'RESOLUE' || statut === 'REJETEE';
  }

  protected changer(statut: StatutReclamation): void {
    if (this.isFinal(statut) && !this.reponse.trim()) {
      this.toast.error('Rédigez la réponse au passager avant de clôturer');
      return;
    }
    this.busy.set(true);
    this.reclamationService.changerStatut(Number(this.id()), { statut, reponse: this.reponse }).subscribe({
      next: (r) => {
        this.reclamation.set(r);
        this.toast.success(`Réclamation : ${this.statutLabels[r.statut]}`);
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }
}
