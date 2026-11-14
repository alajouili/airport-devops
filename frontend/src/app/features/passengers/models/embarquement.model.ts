import { ClasseVoyage, StatutBillet } from './reservation.model';

export type TypePointControle = 'STANDARD' | 'PRIORITAIRE' | 'EQUIPAGE';
export type ResultatControle = 'CONFORME' | 'FOUILLE_COMPLEMENTAIRE' | 'REFUSE';
export type TypeEvenementEmbarquement = 'APPEL' | 'EMBARQUE' | 'REFUSE' | 'NON_PRESENTE';

export const TYPE_POINT_LABELS: Record<TypePointControle, string> = {
  STANDARD: 'Standard',
  PRIORITAIRE: 'Prioritaire',
  EQUIPAGE: 'Équipages',
};

export const RESULTAT_CONTROLE_LABELS: Record<ResultatControle, string> = {
  CONFORME: 'Conforme',
  FOUILLE_COMPLEMENTAIRE: 'Fouille complémentaire',
  REFUSE: 'Refusé',
};

export const RESULTAT_CONTROLE_BADGES: Record<ResultatControle, string> = {
  CONFORME: 'badge-success',
  FOUILLE_COMPLEMENTAIRE: 'badge-warning',
  REFUSE: 'badge-danger',
};

export const EVENEMENT_EMBARQUEMENT_LABELS: Record<TypeEvenementEmbarquement, string> = {
  APPEL: 'Appelé à la porte',
  EMBARQUE: 'Embarqué',
  REFUSE: 'Embarquement refusé',
  NON_PRESENTE: 'Non présenté',
};

export const EVENEMENT_EMBARQUEMENT_BADGES: Record<TypeEvenementEmbarquement, string> = {
  APPEL: 'badge-info',
  EMBARQUE: 'badge-success',
  REFUSE: 'badge-danger',
  NON_PRESENTE: 'badge-warning',
};

export interface PointControle {
  id: number;
  code: string;
  nom: string;
  terminal: string;
  type: TypePointControle;
  actif: boolean;
}

export interface PointControleRequest {
  code: string;
  nom: string;
  terminal: string;
  type: TypePointControle;
  actif: boolean;
}

export interface ControleSecurite {
  id: number;
  pointControleCode: string;
  pointControleNom: string;
  resultat: ResultatControle;
  commentaire: string | null;
  dateControle: string;
}

export interface EvenementEmbarquement {
  id: number;
  typeEvenement: TypeEvenementEmbarquement;
  porte: string;
  commentaire: string | null;
  dateEvenement: string;
}

/** One line of the gate screen (PassagerEmbarquementResponse.java). */
export interface PassagerEmbarquement {
  billetId: number;
  numeroBillet: string;
  statutBillet: StatutBillet;
  reservationId: number;
  reservationReference: string;
  passagerNom: string;
  classe: ClasseVoyage;
  siegeNumero: string | null;
  dernierControle: ControleSecurite | null;
  dernierEvenement: EvenementEmbarquement | null;
  peutEmbarquer: boolean;
}
