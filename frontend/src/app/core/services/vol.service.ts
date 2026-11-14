import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Vol } from '../models/vol.model';

/**
 * Reads flights from Student A's API.
 * It lives in core/ (not in a feature) because several of Student B's
 * modules need flights: reservations, tickets, cargo.
 */
@Injectable({ providedIn: 'root' })
export class VolService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/vols`;

  /** GET /api/vols - upcoming flights, earliest first. */
  getUpcoming(): Observable<Vol[]> {
    return this.http.get<Vol[]>(this.baseUrl);
  }

  /** GET /api/vols/{id} */
  getById(id: number): Observable<Vol> {
    return this.http.get<Vol>(`${this.baseUrl}/${id}`);
  }
}
