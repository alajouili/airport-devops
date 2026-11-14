import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Bagage, BagageDetail, BagageRequest, EvenementBagageRequest, StatutBagage } from '../models/bagage.model';

/** HTTP calls to BagageController.java. */
@Injectable({ providedIn: 'root' })
export class BagageService {
  private readonly http = inject(HttpClient);

  getAll(statut: StatutBagage | null, etiquette: string): Observable<Bagage[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (etiquette.trim()) params = params.set('etiquette', etiquette.trim());
    return this.http.get<Bagage[]>(`${API_BASE_URL}/bagages`, { params });
  }

  getDetail(id: number): Observable<BagageDetail> {
    return this.http.get<BagageDetail>(`${API_BASE_URL}/bagages/${id}`);
  }

  ajouter(enregistrementId: number, request: BagageRequest): Observable<Bagage> {
    return this.http.post<Bagage>(`${API_BASE_URL}/enregistrements/${enregistrementId}/bagages`, request);
  }

  ajouterEvenement(bagageId: number, request: EvenementBagageRequest): Observable<BagageDetail> {
    return this.http.post<BagageDetail>(`${API_BASE_URL}/bagages/${bagageId}/evenements`, request);
  }
}
