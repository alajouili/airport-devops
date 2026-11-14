import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import {
  Paiement,
  PaiementRequest,
  Reservation,
  ReservationDetail,
  ReservationFilters,
  ReservationRequest,
} from '../models/reservation.model';

/** HTTP calls to ReservationController.java (/api/reservations). */
@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reservations`;

  getAll(filters: ReservationFilters = {}): Observable<Reservation[]> {
    // Only the filters that have a value become query parameters (?statut=CONFIRMEE&volId=2).
    let params = new HttpParams();
    if (filters.statut) params = params.set('statut', filters.statut);
    if (filters.volId) params = params.set('volId', filters.volId);
    if (filters.passagerId) params = params.set('passagerId', filters.passagerId);
    return this.http.get<Reservation[]>(this.baseUrl, { params });
  }

  getDetail(id: number): Observable<ReservationDetail> {
    return this.http.get<ReservationDetail>(`${this.baseUrl}/${id}`);
  }

  create(request: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, request);
  }

  payer(id: number, request: PaiementRequest): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.baseUrl}/${id}/paiements`, request);
  }

  annuler(id: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/${id}/annulation`, {});
  }
}
