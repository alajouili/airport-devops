import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import {
  ControleSecurite,
  EvenementEmbarquement,
  PassagerEmbarquement,
  PointControle,
  PointControleRequest,
  ResultatControle,
  TypeEvenementEmbarquement,
} from '../models/embarquement.model';

/** HTTP calls to EmbarquementController.java and PointControleController.java. */
@Injectable({ providedIn: 'root' })
export class EmbarquementService {
  private readonly http = inject(HttpClient);

  // ---------- gate ----------
  getListe(volId: number): Observable<PassagerEmbarquement[]> {
    return this.http.get<PassagerEmbarquement[]>(`${API_BASE_URL}/vols/${volId}/embarquement`);
  }

  enregistrerControle(billetId: number, pointControleId: number, resultat: ResultatControle, commentaire: string): Observable<ControleSecurite> {
    return this.http.post<ControleSecurite>(`${API_BASE_URL}/billets/${billetId}/controles-securite`, {
      pointControleId,
      resultat,
      commentaire,
    });
  }

  enregistrerEvenement(billetId: number, typeEvenement: TypeEvenementEmbarquement, porte: string, commentaire: string): Observable<EvenementEmbarquement> {
    return this.http.post<EvenementEmbarquement>(`${API_BASE_URL}/billets/${billetId}/embarquement`, {
      typeEvenement,
      porte,
      commentaire,
    });
  }

  // ---------- checkpoints ----------
  getPoints(): Observable<PointControle[]> {
    return this.http.get<PointControle[]>(`${API_BASE_URL}/points-controle`);
  }

  createPoint(request: PointControleRequest): Observable<PointControle> {
    return this.http.post<PointControle>(`${API_BASE_URL}/points-controle`, request);
  }

  updatePoint(id: number, request: PointControleRequest): Observable<PointControle> {
    return this.http.put<PointControle>(`${API_BASE_URL}/points-controle/${id}`, request);
  }

  deletePoint(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/points-controle/${id}`);
  }
}
