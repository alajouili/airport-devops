import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Vol } from '../../../../core/models/vol.model';
import { ToastService } from '../../../../core/services/toast.service';
import { VolService } from '../../../../core/services/vol.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  Assistance,
  STATUT_ASSISTANCE_BADGES,
  STATUT_ASSISTANCE_LABELS,
  StatutAssistance,
  TRANSITIONS_ASSISTANCE,
  TYPE_ASSISTANCE_LABELS,
} from '../../models/assistance.model';
import { AssistanceService } from '../../services/assistance.service';

/**
 * Assistance desk: requests sorted by flight departure, with only the
 * next allowed actions shown on each row. Requests are created from the
 * reservation page or from the passenger space.
 */
@Component({
  selector: 'app-assistance-list',
  imports: [FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './assistance-list.html',
})
export class AssistanceList implements OnInit {
  private readonly assistanceService = inject(AssistanceService);
  private readonly volService = inject(VolService);
  private readonly toast = inject(ToastService);

  protected readonly assistances = signal<Assistance[]>([]);
  protected readonly vols = signal<Vol[]>([]);
  protected readonly loading = signal(true);
  protected statut: StatutAssistance | null = null;
  protected volId: number | null = null;

  protected readonly typeLabels = TYPE_ASSISTANCE_LABELS;
  protected readonly statutLabels = STATUT_ASSISTANCE_LABELS;
  protected readonly statutBadges = STATUT_ASSISTANCE_BADGES;
  protected readonly statuts = Object.keys(STATUT_ASSISTANCE_LABELS) as StatutAssistance[];
  protected readonly transitions = TRANSITIONS_ASSISTANCE;
  protected readonly actionLabels: Record<StatutAssistance, string> = {
    DEMANDEE: '',
    CONFIRMEE: 'Confirmer',
    REALISEE: 'Réalisée',
    ANNULEE: 'Annuler',
  };

  ngOnInit(): void {
    this.volService.getUpcoming().subscribe((v) => this.vols.set(v));
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.assistanceService.getAll(this.statut, this.volId).subscribe({
      next: (list) => {
        this.assistances.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected changer(assistance: Assistance, statut: StatutAssistance): void {
    this.assistanceService.changerStatut(assistance.id, statut).subscribe((maj) => {
      this.toast.success(`Assistance : ${this.statutLabels[maj.statut]}`);
      // Replace the updated row in the list.
      this.assistances.update((list) => list.map((a) => (a.id === maj.id ? maj : a)));
    });
  }
}
