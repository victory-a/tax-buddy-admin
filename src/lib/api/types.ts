/** Mirrors backend `ServiceResponse` envelope used by all API routes. */
export type ServiceEnvelope<T> = {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
};
