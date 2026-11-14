import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { SKIP_ERROR_TOAST } from '../../../core/interceptors/http-context';
import { EspacePassager } from '../models/espace.model';

/** HTTP call to EspacePassagerController.java. */
@Injectable({ providedIn: 'root' })
export class EspacePassagerService {
  private readonly http = inject(HttpClient);

  /** POST so the email travels in the body, not in the URL. The page shows its own "not found" message. */
  rechercher(reference: string, email: string): Observable<EspacePassager> {
    return this.http.post<EspacePassager>(
      `${API_BASE_URL}/espace-passager/recherche`,
      { reference, email },
      { context: new HttpContext().set(SKIP_ERROR_TOAST, true) },
    );
  }
}
