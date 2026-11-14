import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_URL } from '../config/api.config';

/** Key under which the login token will be stored (login is built by Student A). */
export const AUTH_TOKEN_KEY = 'ams_token';

/**
 * Adds "Authorization: Bearer <token>" to every request sent to our API.
 *
 * Login (Spring Security) is Student A's responsibility. Until it exists,
 * there is no token and this interceptor simply lets requests pass unchanged.
 * When Student A's login API is ready, the login screen only has to save the
 * token with localStorage.setItem(AUTH_TOKEN_KEY, token).
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = readToken();

  if (!token || !request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }

  // Requests are immutable: we create a modified copy with clone().
  const authorizedRequest = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  return next(authorizedRequest);
};

function readToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    // localStorage can be blocked (private browsing, strict settings).
    return null;
  }
}
