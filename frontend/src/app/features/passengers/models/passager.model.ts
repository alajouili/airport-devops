/** Mirrors PassagerResponse.java */
export interface Passager {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string;
  telephone: string | null;
  dateNaissance: string | null; // "1995-04-12"
  nationalite: string | null;
  numeroPasseport: string | null;
  dateCreation: string;
}

/** Mirrors PassagerRequest.java (what the form sends). */
export interface PassagerRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string | null;
  nationalite: string;
  numeroPasseport: string;
}
