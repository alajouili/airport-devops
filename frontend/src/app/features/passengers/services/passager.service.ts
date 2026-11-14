import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Passager, PassagerRequest } from '../models/passager.model';

/** HTTP calls to PassagerController.java (/api/passagers). */
@Injectable({ providedIn: 'root' })
export class PassagerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/passagers`;

  getAll(recherche = ''): Observable<Passager[]> {
    const params = recherche.trim() ? new HttpParams().set('recherche', recherche.trim()) : undefined;
    return this.http.get<Passager[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Passager> {
    return this.http.get<Passager>(`${this.baseUrl}/${id}`);
  }

  create(request: PassagerRequest): Observable<Passager> {
    return this.http.post<Passager>(this.baseUrl, request);
  }

  update(id: number, request: PassagerRequest): Observable<Passager> {
    return this.http.put<Passager>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
