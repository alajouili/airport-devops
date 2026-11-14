import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Vol } from '../../core/models/vol.model';
import { VolService } from '../../core/services/vol.service';
import { AssistanceService } from '../passengers/services/assistance.service';
import { ObjetTrouveService } from '../passengers/services/objet-trouve.service';
import { ReclamationService } from '../passengers/services/reclamation.service';
import { ReservationService } from '../passengers/services/reservation.service';
import { DeparturesBoard } from '../../shared/components/departures-board/departures-board';
import { Icon } from '../../shared/components/icon/icon';
import { IconName } from '../../shared/components/icon/icons';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StateMessage } from '../../shared/components/state-message/state-message';

/** One "to do" counter. value: null = loading, -1 = could not be loaded. */
interface Counter {
  label: string;
  hint: string;
  icon: IconName;
  route: string;
  value: WritableSignal<number | null>;
  load: () => Observable<unknown[]>;
}

/** One of Student B's modules (section 3 of the specification). */
interface ModuleInfo {
  title: string;
  tables: number;
  icon: IconName;
  route?: string;
}

/**
 * Dashboard. Every number comes from an existing API endpoint (no invented statistic):
 * the counters reuse the list endpoints with their status filter.
 */
@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink, PageHeader, Icon, StateMessage, DeparturesBoard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly volService = inject(VolService);
  private readonly reservationService = inject(ReservationService);
  private readonly assistanceService = inject(AssistanceService);
  private readonly reclamationService = inject(ReclamationService);
  private readonly objetService = inject(ObjetTrouveService);

  protected readonly today = new Date();

  protected readonly vols = signal<Vol[]>([]);
  protected readonly volsState = signal<'loading' | 'ready' | 'error'>('loading');
  /** true when the request never reached the server (Spring Boot stopped). */
  protected readonly backendDown = signal(false);

  /** The next departures only: the full list is on "Vols et horaires". */
  protected readonly prochainsVols = computed(() => this.vols().slice(0, 6));

  protected readonly counters: Counter[] = [
    {
      label: 'Paiements en attente',
      hint: 'Réservations créées, pas encore payées',
      icon: 'credit-card',
      route: '/passengers/reservations',
      value: signal<number | null>(null),
      load: () => this.reservationService.getAll({ statut: 'EN_ATTENTE_PAIEMENT' }),
    },
    {
      label: 'Assistances à confirmer',
      hint: 'Demandes reçues, pas encore confirmées',
      icon: 'accessibility',
      route: '/passengers/assistances',
      value: signal<number | null>(null),
      load: () => this.assistanceService.getAll('DEMANDEE', null),
    },
    {
      label: 'Réclamations ouvertes',
      hint: 'Pas encore prises en charge',
      icon: 'message-square-warning',
      route: '/passengers/reclamations',
      value: signal<number | null>(null),
      load: () => this.reclamationService.getAll('OUVERTE', null),
    },
    {
      label: 'Objets en stock',
      hint: 'Objets trouvés non restitués',
      icon: 'package-search',
      route: '/passengers/objets-trouves',
      value: signal<number | null>(null),
      load: () => this.objetService.getAll('EN_STOCK', null, ''),
    },
  ];

  protected readonly modules: ModuleInfo[] = [
    { title: 'Passagers, billets et bagages', tables: 18, icon: 'luggage', route: '/passengers/reservations' },
    { title: 'Parking, transports et location', tables: 17, icon: 'car-front' },
    { title: 'Facturation et gestion commerciale', tables: 14, icon: 'receipt-text' },
    { title: 'Achats et stocks', tables: 9, icon: 'package' },
    { title: 'Fret et communication', tables: 6, icon: 'bell' },
  ];

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.backendDown.set(false);
    this.volsState.set('loading');
    this.volService.getUpcoming().subscribe({
      next: (vols) => {
        this.vols.set(vols);
        this.volsState.set('ready');
      },
      error: (error: HttpErrorResponse) => {
        this.backendDown.set(error.status === 0);
        this.volsState.set('error');
      },
    });

    for (const counter of this.counters) {
      counter.value.set(null);
      counter.load().subscribe({
        next: (list) => counter.value.set(list.length),
        error: () => counter.value.set(-1),
      });
    }
  }
}
