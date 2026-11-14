/**
 * Shape of every error returned by the backend.
 * It mirrors the Java record com.airport.common.exception.ApiError.
 */
export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  fieldErrors: Record<string, string> | null;
}
