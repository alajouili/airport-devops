export interface Avis {
  id: number;
  reservationId: number;
  reservationReference: string;
  passagerNom: string;
  numeroVol: string;
  compagnieNom: string;
  aeroportArrivee: string;
  note: number;
  commentaire: string | null;
  dateAvis: string;
}

export interface AvisRequest {
  reservationId: number;
  note: number;
  commentaire: string;
}
