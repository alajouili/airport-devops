import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ApiError } from '../models/api-error.model';
import { ToastService } from '../services/toast.service';
import { SKIP_ERROR_TOAST } from './http-context';

/**
 * An interceptor sees every HTTP request and response of the application.
 *
 * This one catches errors in ONE place and shows a readable message,
 * so components do not repeat the same error-handling code.
 * The error is then re-thrown, so a component can still react to it
 * (for example, keep a form open after a 409 Conflict).
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const toast = inject(ToastService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!request.context.get(SKIP_ERROR_TOAST)) {
        toast.error(toUserMessage(error));
      }
      return throwError(() => error);
    }),
  );
};

/** Converts an HTTP error into a sentence the user can understand. */
function toUserMessage(error: HttpErrorResponse): string {
  // Status 0 = the request never reached the server (backend stopped, CORS, network).
  if (error.status === 0) {
    return 'Impossible de joindre le serveur. Le backend Spring Boot est-il démarré ?';
  }

  const body = error.error as ApiError | null;
  if (body?.message) {
    const fieldMessages = body.fieldErrors
      ? Object.entries(body.fieldErrors).map(([field, message]) => `${field} : ${message}`)
      : [];
    return [body.message, ...fieldMessages].join(' — ');
  }

  return `Erreur ${error.status} : ${error.statusText}`;
}
