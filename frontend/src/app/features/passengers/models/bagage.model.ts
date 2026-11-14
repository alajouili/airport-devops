export type TypeBagage = 'SOUTE' | 'CABINE';
export type StatutBagage = 'ENREGISTRE' | 'TRIE' | 'CHARGE' | 'DECHARGE' | 'LIVRE' | 'PERDU' | 'RETROUVE';
export type TypeEvenementBagage =
  | 'SCAN_TRI'
  | 'CHARGEMENT'
  | 'DECHARGEMENT'
  | 'LIVRAISON_TAPIS'
  | 'DECLARATION_PERTE'
  | 'BAGAGE_RETROUVE'
  | 'CONTROLE';

export const TYPE_BAGAGE_LABELS: Record<TypeBagage, string> = {
  SOUTE: 'Soute (max 32 kg)',
  CABINE: 'Cabine (max 10 kg)',
};

export const STATUT_BAGAGE_LABELS: Record<StatutBagage, string> = {
  ENREGISTRE: 'Enregistré',
  TRIE: 'Trié',
  CHARGE: 'Chargé',
  DECHARGE: 'Déchargé',
  LIVRE: 'Livré',
  PERDU: 'Perdu',
  RETROUVE: 'Retrouvé',
};

export const STATUT_BAGAGE_BADGES: Record<StatutBagage, string> = {
  ENREGISTRE: 'badge-info',
  TRIE: 'badge-info',
  CHARGE: 'badge-info',
  DECHARGE: 'badge-info',
  LIVRE: 'badge-success',
  PERDU: 'badge-danger',
  RETROUVE: 'badge-warning',
};

export const TYPE_EVENEMENT_LABELS: Record<TypeEvenementBagage, string> = {
  SCAN_TRI: 'Scan au tri',
  CHARGEMENT: "Chargement dans l'avion",
  DECHARGEMENT: 'Déchargement',
  LIVRAISON_TAPIS: 'Livraison sur le tapis',
  DECLARATION_PERTE: 'Déclaration de perte',
  BAGAGE_RETROUVE: 'Bagage retrouvé',
  CONTROLE: 'Contrôle (sans changement de statut)',
};

export interface Bagage {
  id: number;
  numeroEtiquette: string;
  type: TypeBagage;
  poidsKg: number;
  statut: StatutBagage;
  dateCreation: string;
  reservationId: number;
  reservationReference: string;
  passagerId: number;
  passagerNom: string;
  numeroVol: string;
  aeroportArrivee: string;
}

export interface HistoriqueBagage {
  id: number;
  ancienStatut: StatutBagage | null;
  nouveauStatut: StatutBagage;
  commentaire: string | null;
  dateChangement: string;
}

export interface EvenementBagage {
  id: number;
  typeEvenement: TypeEvenementBagage;
  lieu: string;
  commentaire: string | null;
  dateEvenement: string;
}

export interface BagageDetail {
  bagage: Bagage;
  historique: HistoriqueBagage[];
  evenements: EvenementBagage[];
}

export interface BagageRequest {
  type: TypeBagage;
  poidsKg: number;
}

export interface EvenementBagageRequest {
  typeEvenement: TypeEvenementBagage;
  lieu: string;
  commentaire: string;
}
