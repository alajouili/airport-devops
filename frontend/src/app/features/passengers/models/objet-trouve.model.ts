export type CategorieObjet = 'ELECTRONIQUE' | 'BAGAGERIE' | 'DOCUMENT' | 'VETEMENT' | 'BIJOU' | 'AUTRE';
export type StatutObjet = 'EN_STOCK' | 'RESTITUE' | 'ELIMINE';
export type StatutRestitution = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export const CATEGORIE_OBJET_LABELS: Record<CategorieObjet, string> = {
  ELECTRONIQUE: 'Électronique',
  BAGAGERIE: 'Bagagerie',
  DOCUMENT: 'Document',
  VETEMENT: 'Vêtement',
  BIJOU: 'Bijou',
  AUTRE: 'Autre',
};

export const STATUT_OBJET_LABELS: Record<StatutObjet, string> = {
  EN_STOCK: 'En stock',
  RESTITUE: 'Restitué',
  ELIMINE: 'Éliminé',
};

export const STATUT_OBJET_BADGES: Record<StatutObjet, string> = {
  EN_STOCK: 'badge-info',
  RESTITUE: 'badge-success',
  ELIMINE: 'badge-neutral',
};

export const STATUT_RESTITUTION_LABELS: Record<StatutRestitution, string> = {
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
};

export const STATUT_RESTITUTION_BADGES: Record<StatutRestitution, string> = {
  EN_ATTENTE: 'badge-warning',
  ACCEPTEE: 'badge-success',
  REFUSEE: 'badge-neutral',
};

export interface ObjetTrouve {
  id: number;
  reference: string;
  description: string;
  categorie: CategorieObjet;
  lieuTrouve: string;
  dateTrouve: string;
  statut: StatutObjet;
  dateEnregistrement: string;
  dateSortie: string | null;
  /** Computed by the server: the 90-day rule allows elimination now. */
  eliminable: boolean;
}

export interface Restitution {
  id: number;
  passagerId: number | null;
  nomDemandeur: string;
  contact: string;
  descriptionPreuve: string;
  statut: StatutRestitution;
  commentaireDecision: string | null;
  dateDemande: string;
  dateDecision: string | null;
}

export interface ObjetTrouveDetail {
  objet: ObjetTrouve;
  demandes: Restitution[];
}

export interface ObjetTrouveRequest {
  description: string;
  categorie: CategorieObjet;
  lieuTrouve: string;
  /** "2026-10-29T14:30" from an <input type="datetime-local"> */
  dateTrouve: string;
}

export interface RestitutionRequest {
  passagerId: number | null;
  nomDemandeur: string;
  contact: string;
  descriptionPreuve: string;
}
