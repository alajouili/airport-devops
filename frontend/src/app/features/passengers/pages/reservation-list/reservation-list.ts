import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Vol } from '../../../../core/models/vol.model';
import { VolService } from '../../../../core/services/vol.service';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import {
  CLASSE_LABELS,
  Reservation,
  STATUT_RESERVATION_BADGES,
  STATUT_RESERVATION_LABELS,
  StatutReservation,
} from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-list',
  imports: [FormsModule, RouterLink, DatePipe, CurrencyPipe, PageHeader],
  templateUrl: './reservation-list.html',
})
export class ReservationList implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly volService = inject(VolService);

  protected readonly reservations = signal<Reservation[]>([]);
  protected readonly vols = signal<Vol[]>([]);
  protected readonly loading = signal(true);

  protected statut: StatutReservation | null = null;
  protected volId: number | null = null;

  protected readonly statutLabels = STATUT_RESERVATION_LABELS;
  protected readonly statutBadges = STATUT_RESERVATION_BADGES;
  protected readonly classeLabels = CLASSE_LABELS;
  /** Object.keys gives the list of statuses for the filter drop-down. */
  protected readonly statuts = Object.keys(STATUT_RESERVATION_LABELS) as StatutReservation[];

  ngOnInit(): void {
    this.volService.getUpcoming().subscribe((vols) => this.vols.set(vols));
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.reservationService.getAll({ statut: this.statut, volId: this.volId }).subscribe({
      next: (reservations) => {
        this.reservations.set(reservations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
