/**
 * A flight, as returned by GET /api/vols.
 * Mirrors the Java record com.airport.operations.dto.VolResponse (Student A's API).
 * Dates arrive as ISO strings, for example "2026-10-30T08:30:00".
 */
export interface Vol {
  id: number;
  numeroVol: string;
  compagnieCode: string;
  compagnieNom: string;
  aeroportDepart: string;
  aeroportArrivee: string;
  dateHeureDepart: string;
  dateHeureArrivee: string;
  capacite: number;
  statut: StatutVol;
}

export type StatutVol = 'PROGRAMME' | 'EMBARQUEMENT' | 'RETARDE' | 'PARTI' | 'ARRIVE' | 'ANNULE';

/** French labels shown in the interface for each status. */
export const STATUT_VOL_LABELS: Record<StatutVol, string> = {
  PROGRAMME: 'Programmé',
  EMBARQUEMENT: 'Embarquement',
  RETARDE: 'Retardé',
  PARTI: 'Parti',
  ARRIVE: 'Arrivé',
  ANNULE: 'Annulé',
};

/** CSS badge class (defined in styles.css) for each status. */
export const STATUT_VOL_BADGES: Record<StatutVol, string> = {
  PROGRAMME: 'badge-info',
  EMBARQUEMENT: 'badge-success',
  RETARDE: 'badge-warning',
  PARTI: 'badge-neutral',
  ARRIVE: 'badge-neutral',
  ANNULE: 'badge-danger',
};
