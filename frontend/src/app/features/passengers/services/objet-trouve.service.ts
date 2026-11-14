import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import {
  CategorieObjet,
  ObjetTrouve,
  ObjetTrouveDetail,
  ObjetTrouveRequest,
  RestitutionRequest,
  StatutObjet,
} from '../models/objet-trouve.model';

/** HTTP calls to ObjetTrouveController.java. */
@Injectable({ providedIn: 'root' })
export class ObjetTrouveService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/objets-trouves`;

  getAll(statut: StatutObjet | null, categorie: CategorieObjet | null, recherche: string): Observable<ObjetTrouve[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (categorie) params = params.set('categorie', categorie);
    if (recherche.trim()) params = params.set('recherche', recherche.trim());
    return this.http.get<ObjetTrouve[]>(this.baseUrl, { params });
  }

  getDetail(id: number): Observable<ObjetTrouveDetail> {
    return this.http.get<ObjetTrouveDetail>(`${this.baseUrl}/${id}`);
  }

  create(request: ObjetTrouveRequest): Observable<ObjetTrouve> {
    return this.http.post<ObjetTrouve>(this.baseUrl, request);
  }

  ajouterDemande(objetId: number, request: RestitutionRequest): Observable<ObjetTrouveDetail> {
    return this.http.post<ObjetTrouveDetail>(`${this.baseUrl}/${objetId}/demandes`, request);
  }

  decider(demandeId: number, acceptee: boolean, commentaire: string): Observable<ObjetTrouveDetail> {
    return this.http.post<ObjetTrouveDetail>(`${API_BASE_URL}/demandes-restitution/${demandeId}/decision`, {
      acceptee,
      commentaire,
    });
  }

  eliminer(objetId: number): Observable<ObjetTrouveDetail> {
    return this.http.post<ObjetTrouveDetail>(`${this.baseUrl}/${objetId}/elimination`, {});
  }
}
