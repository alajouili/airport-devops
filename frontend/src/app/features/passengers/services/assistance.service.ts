import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Assistance, AssistanceRequest, StatutAssistance } from '../models/assistance.model';

/** HTTP calls to AssistanceController.java. */
@Injectable({ providedIn: 'root' })
export class AssistanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/assistances`;

  getAll(statut: StatutAssistance | null, volId: number | null): Observable<Assistance[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (volId) params = params.set('volId', volId);
    return this.http.get<Assistance[]>(this.baseUrl, { params });
  }

  create(request: AssistanceRequest): Observable<Assistance> {
    return this.http.post<Assistance>(this.baseUrl, request);
  }

  changerStatut(id: number, statut: StatutAssistance): Observable<Assistance> {
    return this.http.put<Assistance>(`${this.baseUrl}/${id}/statut`, { statut });
  }
}
