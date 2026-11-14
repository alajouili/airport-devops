/** Response of GET /api/health (see HealthController.java). */
export interface HealthStatus {
  status: 'UP' | 'DOWN';
  database: 'UP' | 'DOWN';
  timestamp: string;
}
