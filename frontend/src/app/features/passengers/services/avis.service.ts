import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Avis, AvisRequest } from '../models/avis.model';

/** HTTP calls to AvisController.java. */
@Injectable({ providedIn: 'root' })
export class AvisService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/avis`;

  getAll(note: number | null): Observable<Avis[]> {
    const params = note ? new HttpParams().set('note', note) : undefined;
    return this.http.get<Avis[]>(this.baseUrl, { params });
  }

  create(request: AvisRequest): Observable<Avis> {
    return this.http.post<Avis>(this.baseUrl, request);
  }
}
