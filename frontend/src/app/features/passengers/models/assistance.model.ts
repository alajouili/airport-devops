export type TypeAssistance =
  | 'FAUTEUIL_ROULANT'
  | 'MOBILITE_REDUITE'
  | 'MALVOYANT'
  | 'MALENTENDANT'
  | 'MINEUR_NON_ACCOMPAGNE'
  | 'AUTRE';
export type StatutAssistance = 'DEMANDEE' | 'CONFIRMEE' | 'REALISEE' | 'ANNULEE';

export const TYPE_ASSISTANCE_LABELS: Record<TypeAssistance, string> = {
  FAUTEUIL_ROULANT: 'Fauteuil roulant',
  MOBILITE_REDUITE: 'Mobilité réduite',
  MALVOYANT: 'Passager malvoyant',
  MALENTENDANT: 'Passager malentendant',
  MINEUR_NON_ACCOMPAGNE: 'Mineur non accompagné',
  AUTRE: 'Autre besoin',
};

export const STATUT_ASSISTANCE_LABELS: Record<StatutAssistance, string> = {
  DEMANDEE: 'Demandée',
  CONFIRMEE: 'Confirmée',
  REALISEE: 'Réalisée',
  ANNULEE: 'Annulée',
};

export const STATUT_ASSISTANCE_BADGES: Record<StatutAssistance, string> = {
  DEMANDEE: 'badge-warning',
  CONFIRMEE: 'badge-info',
  REALISEE: 'badge-success',
  ANNULEE: 'badge-neutral',
};

/** Next statuses allowed from each status (same rule as StatutAssistance.java). */
export const TRANSITIONS_ASSISTANCE: Record<StatutAssistance, StatutAssistance[]> = {
  DEMANDEE: ['CONFIRMEE', 'ANNULEE'],
  CONFIRMEE: ['REALISEE', 'ANNULEE'],
  REALISEE: [],
  ANNULEE: [],
};

export interface Assistance {
  id: number;
  reservationId: number;
  reservationReference: string;
  passagerNom: string;
  numeroVol: string;
  dateHeureDepart: string;
  typeAssistance: TypeAssistance;
  description: string | null;
  statut: StatutAssistance;
  dateDemande: string;
  dateMiseAJour: string | null;
}

export interface AssistanceRequest {
  reservationId: number;
  typeAssistance: TypeAssistance;
  description: string;
}
