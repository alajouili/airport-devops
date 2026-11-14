import { HttpContextToken } from '@angular/common/http';

/**
 * A flag a service can attach to one HTTP request to say:
 * "if this request fails, do NOT show the global error toast, I handle it myself".
 *
 * Example: the health check on the home page displays its own
 * "backend unreachable" message, so a toast would be a duplicate.
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);
