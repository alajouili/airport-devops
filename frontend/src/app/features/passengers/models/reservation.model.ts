/* Types mirroring the Java enums and DTOs of the reservation flow. */

import { Assistance } from './assistance.model';
import { Avis } from './avis.model';
import { Bagage } from './bagage.model';

export type ClasseVoyage = 'ECONOMIQUE' | 'AFFAIRES';
export type StatutReservation = 'EN_ATTENTE_PAIEMENT' | 'CONFIRMEE' | 'ANNULEE';
export type ModePaiement = 'CARTE' | 'ESPECES' | 'VIREMENT';
export type StatutPaiement = 'ACCEPTE' | 'REFUSE';
export type StatutBillet = 'EMIS' | 'UTILISE' | 'ANNULE';
export type CanalEnregistrement = 'COMPTOIR' | 'EN_LIGNE' | 'BORNE';

export const CLASSE_LABELS: Record<ClasseVoyage, string> = {
  ECONOMIQUE: 'Économique',
  AFFAIRES: 'Affaires',
};

/**
 * Indicative prices shown in the booking form.
 * The REAL amount is always computed by the server (ClasseVoyage.java).
 */
export const CLASSE_PRIX_INDICATIF: Record<ClasseVoyage, number> = {
  ECONOMIQUE: 350,
  AFFAIRES: 950,
};

export const STATUT_RESERVATION_LABELS: Record<StatutReservation, string> = {
  EN_ATTENTE_PAIEMENT: 'En attente de paiement',
  CONFIRMEE: 'Confirmée',
  ANNULEE: 'Annulée',
};

export const STATUT_RESERVATION_BADGES: Record<StatutReservation, string> = {
  EN_ATTENTE_PAIEMENT: 'badge-warning',
  CONFIRMEE: 'badge-success',
  ANNULEE: 'badge-danger',
};

export const MODE_PAIEMENT_LABELS: Record<ModePaiement, string> = {
  CARTE: 'Carte bancaire (simulée)',
  ESPECES: 'Espèces',
  VIREMENT: 'Virement',
};

export const STATUT_BILLET_LABELS: Record<StatutBillet, string> = {
  EMIS: 'Émis',
  UTILISE: 'Utilisé',
  ANNULE: 'Annulé',
};

export const CANAL_LABELS: Record<CanalEnregistrement, string> = {
  COMPTOIR: 'Comptoir',
  EN_LIGNE: 'En ligne',
  BORNE: 'Borne libre-service',
};

export interface Reservation {
  id: number;
  reference: string;
  passagerId: number;
  passagerNom: string;
  volId: number;
  numeroVol: string;
  compagnieNom: string;
  aeroportDepart: string;
  aeroportArrivee: string;
  dateHeureDepart: string;
  classe: ClasseVoyage;
  montant: number;
  statut: StatutReservation;
  dateReservation: string;
  dateAnnulation: string | null;
}

export interface Paiement {
  id: number;
  montant: number;
  mode: ModePaiement;
  statut: StatutPaiement;
  referenceTransaction: string;
  datePaiement: string;
}

export interface Billet {
  id: number;
  numeroBillet: string;
  reservationId: number;
  statut: StatutBillet;
  dateEmission: string;
  siegeId: number | null;
  siegeNumero: string | null;
  enregistrementId: number | null;
  canalEnregistrement: CanalEnregistrement | null;
  dateEnregistrement: string | null;
}

export interface Siege {
  id: number;
  numero: string; // "12A"
  classe: ClasseVoyage;
  occupe: boolean;
}

/** Mirrors ReservationDetailResponse.java: everything for the detail page. */
export interface ReservationDetail {
  reservation: Reservation;
  paiements: Paiement[];
  billet: Billet | null;
  bagages: Bagage[];
  assistances: Assistance[];
  avis: Avis | null;
}

export interface ReservationRequest {
  passagerId: number;
  volId: number;
  classe: ClasseVoyage;
}

export interface PaiementRequest {
  mode: ModePaiement;
  simulerRefus: boolean;
}

export interface ReservationFilters {
  statut?: StatutReservation | null;
  volId?: number | null;
  passagerId?: number | null;
}
