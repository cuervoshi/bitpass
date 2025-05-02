export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
  timestamp: string;
}