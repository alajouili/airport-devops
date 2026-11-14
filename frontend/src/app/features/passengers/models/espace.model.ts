import { Reclamation } from './reclamation.model';
import { ReservationDetail } from './reservation.model';

export interface EspacePassager {
  voyage: ReservationDetail;
  reclamations: Reclamation[];
}
