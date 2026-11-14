import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { STATUT_VOL_LABELS, StatutVol, Vol } from '../../../core/models/vol.model';

/**
 * A departures board, like the screens in an airport hall:
 * time, destination, flight and status on a dark background.
 *
 *   <app-departures-board [vols]="vols()" />
 *   <app-departures-board [vols]="vols()" [showDate]="true" />   (date on each row)
 *
 * Display only: the parent loads the flights and handles loading / error states.
 */
@Component({
  selector: 'app-departures-board',
  imports: [DatePipe],
  templateUrl: './departures-board.html',
  styleUrl: './departures-board.css',
})
export class DeparturesBoard {
  readonly vols = input.required<Vol[]>();
  /** Shows the day next to the time (useful when the list spans several days). */
  readonly showDate = input(false);

  protected readonly statutLabels = STATUT_VOL_LABELS;

  /** Color of the status text on the board (amber for delays, red for cancellations). */
  protected tone(statut: StatutVol): string {
    switch (statut) {
      case 'EMBARQUEMENT':
        return 'go';
      case 'RETARDE':
        return 'late';
      case 'ANNULE':
        return 'cancelled';
      case 'PARTI':
      case 'ARRIVE':
        return 'done';
      default:
        return 'scheduled';
    }
  }
}
