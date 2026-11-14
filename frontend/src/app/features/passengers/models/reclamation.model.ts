export type CategorieReclamation = 'BAGAGE' | 'RETARD_ANNULATION' | 'SERVICE' | 'REMBOURSEMENT' | 'AUTRE';
export type StatutReclamation = 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'REJETEE';

export const CATEGORIE_RECLAMATION_LABELS: Record<CategorieReclamation, string> = {
  BAGAGE: 'Bagage',
  RETARD_ANNULATION: 'Retard ou annulation',
  SERVICE: 'Qualité de service',
  REMBOURSEMENT: 'Remboursement',
  AUTRE: 'Autre',
};

export const STATUT_RECLAMATION_LABELS: Record<StatutReclamation, string> = {
  OUVERTE: 'Ouverte',
  EN_COURS: 'En cours',
  RESOLUE: 'Résolue',
  REJETEE: 'Rejetée',
};

export const STATUT_RECLAMATION_BADGES: Record<StatutReclamation, string> = {
  OUVERTE: 'badge-warning',
  EN_COURS: 'badge-info',
  RESOLUE: 'badge-success',
  REJETEE: 'badge-neutral',
};

/** Same rule as StatutReclamation.java. */
export const TRANSITIONS_RECLAMATION: Record<StatutReclamation, StatutReclamation[]> = {
  OUVERTE: ['EN_COURS', 'REJETEE'],
  EN_COURS: ['RESOLUE', 'REJETEE'],
  RESOLUE: [],
  REJETEE: [],
};

export interface Reclamation {
  id: number;
  reference: string;
  passagerId: number;
  passagerNom: string;
  reservationId: number | null;
  reservationReference: string | null;
  bagageId: number | null;
  bagageEtiquette: string | null;
  categorie: CategorieReclamation;
  sujet: string;
  description: string;
  statut: StatutReclamation;
  reponse: string | null;
  dateCreation: string;
  dateCloture: string | null;
}

export interface ReclamationRequest {
  passagerId: number;
  reservationId: number | null;
  bagageId: number | null;
  categorie: CategorieReclamation;
  sujet: string;
  description: string;
}

export interface ReclamationStatutRequest {
  statut: StatutReclamation;
  reponse: string;
}
