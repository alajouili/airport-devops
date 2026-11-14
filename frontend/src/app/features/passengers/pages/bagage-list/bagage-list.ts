import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Bagage, STATUT_BAGAGE_BADGES, STATUT_BAGAGE_LABELS, StatutBagage } from '../../models/bagage.model';
import { BagageService } from '../../services/bagage.service';

/** All registered bags, searchable by tag number and filterable by status. */
@Component({
  selector: 'app-bagage-list',
  imports: [FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './bagage-list.html',
})
export class BagageList implements OnInit {
  private readonly bagageService = inject(BagageService);

  protected readonly bagages = signal<Bagage[]>([]);
  protected readonly loading = signal(true);
  protected statut: StatutBagage | null = null;
  protected etiquette = '';

  protected readonly statutLabels = STATUT_BAGAGE_LABELS;
  protected readonly statutBadges = STATUT_BAGAGE_BADGES;
  protected readonly statuts = Object.keys(STATUT_BAGAGE_LABELS) as StatutBagage[];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.bagageService.getAll(this.statut, this.etiquette).subscribe({
      next: (bagages) => {
        this.bagages.set(bagages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
