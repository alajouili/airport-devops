import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CATEGORIE_RECLAMATION_LABELS,
  CategorieReclamation,
  Reclamation,
  STATUT_RECLAMATION_BADGES,
  STATUT_RECLAMATION_LABELS,
  StatutReclamation,
} from '../../models/reclamation.model';
import { ReclamationService } from '../../services/reclamation.service';

@Component({
  selector: 'app-reclamation-list',
  imports: [FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './reclamation-list.html',
})
export class ReclamationList implements OnInit {
  private readonly reclamationService = inject(ReclamationService);

  protected readonly reclamations = signal<Reclamation[]>([]);
  protected readonly loading = signal(true);
  protected statut: StatutReclamation | null = null;
  protected categorie: CategorieReclamation | null = null;

  protected readonly statutLabels = STATUT_RECLAMATION_LABELS;
  protected readonly statutBadges = STATUT_RECLAMATION_BADGES;
  protected readonly statuts = Object.keys(STATUT_RECLAMATION_LABELS) as StatutReclamation[];
  protected readonly categorieLabels = CATEGORIE_RECLAMATION_LABELS;
  protected readonly categories = Object.keys(CATEGORIE_RECLAMATION_LABELS) as CategorieReclamation[];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.reclamationService.getAll(this.statut, this.categorie).subscribe({
      next: (list) => {
        this.reclamations.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
