import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { SKIP_ERROR_TOAST } from '../interceptors/http-context';
import { HealthStatus } from '../models/health.model';

/** Calls GET /api/health to know if the backend and the database are running. */
@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  check(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${API_BASE_URL}/health`, {
      context: new HttpContext().set(SKIP_ERROR_TOAST, true),
    });
  }
}
