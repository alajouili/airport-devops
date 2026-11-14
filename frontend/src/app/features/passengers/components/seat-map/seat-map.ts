import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';

import { ClasseVoyage, Siege } from '../../models/reservation.model';
import { BilletService } from '../../services/billet.service';

/** One row of the seat map: row number + seats A..F. */
interface Rangee {
  numero: number;
  sieges: Siege[];
}

/**
 * Clickable seat map of a flight.
 *
 * Inputs (from the parent):  volId, classe (seats of the other class are disabled),
 *                            siegeActuelId (current seat of the ticket, shown selected).
 * Output (to the parent):    siegeChoisi emits the id of the clicked seat.
 * The parent decides what to do with it (call the API): this component only displays.
 */
@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.css',
})
export class SeatMap implements OnInit {
  private readonly billetService = inject(BilletService);

  readonly volId = input.required<number>();
  readonly classe = input.required<ClasseVoyage>();
  readonly siegeActuelId = input<number | null>(null);
  readonly siegeChoisi = output<number>();

  protected readonly sieges = signal<Siege[]>([]);
  protected readonly loading = signal(true);

  /** Groups the flat list of seats into rows, using the number part of "12A". */
  protected readonly rangees = computed<Rangee[]>(() => {
    const parRangee = new Map<number, Siege[]>();
    for (const siege of this.sieges()) {
      const numero = parseInt(siege.numero, 10);
      parRangee.set(numero, [...(parRangee.get(numero) ?? []), siege]);
    }
    return [...parRangee.entries()].map(([numero, sieges]) => ({ numero, sieges }));
  });

  ngOnInit(): void {
    this.billetService.getPlanSieges(this.volId()).subscribe({
      next: (sieges) => {
        this.sieges.set(sieges);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected selectable(siege: Siege): boolean {
    return siege.classe === this.classe() && (!siege.occupe || siege.id === this.siegeActuelId());
  }

  protected choose(siege: Siege): void {
    if (this.selectable(siege) && siege.id !== this.siegeActuelId()) {
      this.siegeChoisi.emit(siege.id);
    }
  }

  /** Letter of the seat ("A".."F"); an aisle is drawn after C. */
  protected lettre(siege: Siege): string {
    return siege.numero.replace(/^\d+/, '');
  }
}
