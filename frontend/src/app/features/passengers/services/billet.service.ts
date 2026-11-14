import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Billet, CanalEnregistrement, Siege } from '../models/reservation.model';

/** HTTP calls to BilletController.java and SiegeController.java. */
@Injectable({ providedIn: 'root' })
export class BilletService {
  private readonly http = inject(HttpClient);

  getPlanSieges(volId: number): Observable<Siege[]> {
    return this.http.get<Siege[]>(`${API_BASE_URL}/vols/${volId}/sieges`);
  }

  choisirSiege(billetId: number, siegeId: number): Observable<Billet> {
    return this.http.put<Billet>(`${API_BASE_URL}/billets/${billetId}/siege`, { siegeId });
  }

  enregistrer(billetId: number, canal: CanalEnregistrement): Observable<Billet> {
    return this.http.post<Billet>(`${API_BASE_URL}/billets/${billetId}/enregistrement`, { canal });
  }
}
