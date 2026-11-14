import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import {
  CategorieReclamation,
  Reclamation,
  ReclamationRequest,
  ReclamationStatutRequest,
  StatutReclamation,
} from '../models/reclamation.model';

/** HTTP calls to ReclamationController.java. */
@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reclamations`;

  getAll(statut: StatutReclamation | null, categorie: CategorieReclamation | null): Observable<Reclamation[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (categorie) params = params.set('categorie', categorie);
    return this.http.get<Reclamation[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.baseUrl}/${id}`);
  }

  create(request: ReclamationRequest): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.baseUrl, request);
  }

  changerStatut(id: number, request: ReclamationStatutRequest): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/statut`, request);
  }
}
