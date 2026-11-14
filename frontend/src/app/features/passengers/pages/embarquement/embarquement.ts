import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Vol } from '../../../../core/models/vol.model';
import { ToastService } from '../../../../core/services/toast.service';
import { VolService } from '../../../../core/services/vol.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  EVENEMENT_EMBARQUEMENT_BADGES,
  EVENEMENT_EMBARQUEMENT_LABELS,
  PassagerEmbarquement,
  PointControle,
  RESULTAT_CONTROLE_BADGES,
  RESULTAT_CONTROLE_LABELS,
  ResultatControle,
  TypeEvenementEmbarquement,
} from '../../models/embarquement.model';
import { CLASSE_LABELS } from '../../models/reservation.model';
import { EmbarquementService } from '../../services/embarquement.service';

/**
 * Boarding gate screen.
 * 1. Choose the flight and the gate.  2. Select a passenger in the list.
 * 3. Record the security check, then the gate events. The server decides if
 *    boarding is allowed (peutEmbarquer) and refuses it otherwise.
 */
@Component({
  selector: 'app-embarquement',
  imports: [FormsModule, RouterLink, DatePipe, PageHeader],
  templateUrl: './embarquement.html',
  styleUrl: './embarquement.css',
})
export class EmbarquementPage implements OnInit {
  private readonly embarquementService = inject(EmbarquementService);
  private readonly volService = inject(VolService);
  private readonly toast = inject(ToastService);

  protected readonly vols = signal<Vol[]>([]);
  protected readonly points = signal<PointControle[]>([]);
  protected readonly passagers = signal<PassagerEmbarquement[]>([]);
  protected readonly selectionId = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);

  protected volId: number | null = null;
  protected porte = '';
  protected pointControleId: number | null = null;
  protected resultat: ResultatControle = 'CONFORME';
  protected commentaire = '';

  protected readonly resultatLabels = RESULTAT_CONTROLE_LABELS;
  protected readonly resultatBadges = RESULTAT_CONTROLE_BADGES;
  protected readonly resultats = Object.keys(RESULTAT_CONTROLE_LABELS) as ResultatControle[];
  protected readonly evenementLabels = EVENEMENT_EMBARQUEMENT_LABELS;
  protected readonly evenementBadges = EVENEMENT_EMBARQUEMENT_BADGES;
  protected readonly classeLabels = CLASSE_LABELS;

  protected readonly selection = computed(() => this.passagers().find((p) => p.billetId === this.selectionId()) ?? null);

  protected readonly compteurs = computed(() => {
    const list = this.passagers();
    return {
      total: list.length,
      embarques: list.filter((p) => p.statutBillet === 'UTILISE').length,
      prets: list.filter((p) => p.peutEmbarquer).length,
    };
  });

  ngOnInit(): void {
    this.volService.getUpcoming().subscribe((vols) =>
      this.vols.set(vols.filter((v) => v.statut !== 'PARTI' && v.statut !== 'ARRIVE' && v.statut !== 'ANNULE')),
    );
    this.embarquementService.getPoints().subscribe((points) => {
      const actifs = points.filter((p) => p.actif);
      this.points.set(actifs);
      this.pointControleId = actifs[0]?.id ?? null;
    });
  }

  protected chargerVol(): void {
    this.selectionId.set(null);
    if (!this.volId) {
      this.passagers.set([]);
      return;
    }
    this.loading.set(true);
    this.embarquementService.getListe(this.volId).subscribe({
      next: (list) => {
        this.passagers.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected selectionner(p: PassagerEmbarquement): void {
    this.selectionId.set(p.billetId);
    this.commentaire = '';
  }

  protected controler(p: PassagerEmbarquement): void {
    if (!this.pointControleId) {
      this.toast.error('Choisissez un point de contrôle');
      return;
    }
    this.run(
      this.embarquementService.enregistrerControle(p.billetId, this.pointControleId, this.resultat, this.commentaire),
      `Contrôle enregistré : ${this.resultatLabels[this.resultat]}`,
    );
  }

  protected evenement(p: PassagerEmbarquement, type: TypeEvenementEmbarquement): void {
    if (!this.porte.trim()) {
      this.toast.error('Indiquez la porte d\'embarquement');
      return;
    }
    this.run(
      this.embarquementService.enregistrerEvenement(p.billetId, type, this.porte, this.commentaire),
      this.evenementLabels[type],
    );
  }

  /** Runs the call, shows the message, then reloads the list (the server state is the truth). */
  private run<T>(call: Observable<T>, message: string): void {
    this.busy.set(true);
    call.subscribe({
      next: () => {
        this.toast.success(message);
        this.commentaire = '';
        this.busy.set(false);
        this.recharger();
      },
      error: () => this.busy.set(false),
    });
  }

  /** Reload without losing the selected passenger. */
  private recharger(): void {
    if (!this.volId) {
      return;
    }
    this.embarquementService.getListe(this.volId).subscribe((list) => this.passagers.set(list));
  }
}
