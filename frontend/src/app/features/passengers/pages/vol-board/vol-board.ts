import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { STATUT_VOL_LABELS, StatutVol, Vol } from '../../../../core/models/vol.model';
import { VolService } from '../../../../core/services/vol.service';
import { DeparturesBoard } from '../../../../shared/components/departures-board/departures-board';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StateMessage } from '../../../../shared/components/state-message/state-message';

/** One day of the board: its date and its flights. */
interface JourVols {
  jour: string; // "2026-10-30"
  vols: Vol[];
}

/**
 * Public flight schedule (departures board). Read-only, open to everyone.
 * The data comes from Student A's flight API; search and status filter run in the browser.
 */
@Component({
  selector: 'app-vol-board',
  imports: [FormsModule, DatePipe, PageHeader, Icon, StateMessage, DeparturesBoard],
  templateUrl: './vol-board.html',
  styleUrl: './vol-board.css',
})
export class VolBoard implements OnInit {
  private readonly volService = inject(VolService);

  protected readonly vols = signal<Vol[]>([]);
  protected readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  /** Signals, so the filtered list recomputes on every key stroke or click. */
  protected readonly recherche = signal('');
  protected readonly statut = signal<StatutVol | null>(null);

  protected readonly statutLabels = STATUT_VOL_LABELS;

  /** Only the statuses that exist in the data are offered as filters. */
  protected readonly statutsPresents = computed(() => {
    const presents = new Set(this.vols().map((v) => v.statut));
    return (Object.keys(STATUT_VOL_LABELS) as StatutVol[]).filter((s) => presents.has(s));
  });

  protected readonly volsFiltres = computed(() => {
    const texte = this.recherche().trim().toLowerCase();
    const statut = this.statut();
    return this.vols().filter(
      (vol) =>
        (!statut || vol.statut === statut) &&
        (!texte ||
          vol.aeroportArrivee.toLowerCase().includes(texte) ||
          vol.numeroVol.toLowerCase().includes(texte) ||
          vol.compagnieNom.toLowerCase().includes(texte)),
    );
  });

  /** Filtered flights grouped by departure day. */
  protected readonly jours = computed<JourVols[]>(() => {
    const groupes = new Map<string, Vol[]>();
    for (const vol of this.volsFiltres()) {
      const jour = vol.dateHeureDepart.substring(0, 10);
      groupes.set(jour, [...(groupes.get(jour) ?? []), vol]);
    }
    return [...groupes.entries()].map(([jour, vols]) => ({ jour, vols }));
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.state.set('loading');
    this.volService.getUpcoming().subscribe({
      next: (vols) => {
        this.vols.set(vols);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }

  protected effacer(): void {
    this.recherche.set('');
    this.statut.set(null);
  }
}
