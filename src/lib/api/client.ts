import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** When true, the response interceptor will not surface a toast for this request. */
    skipErrorToast?: boolean;
  }
}

import { env } from "@/lib/env";
import { Logger } from "@/lib/logger";
import { showToast } from "@/lib/toast";

import { handleUnauthorized } from "./auth";

const DEFAULT_TIMEOUT_MS = 30_000;

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
  isNetworkError?: boolean;
}

export const client = axios.create({
  baseURL: `${env.BASE_URL}/api`,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError): Promise<never> => {
    const skipErrorToast = (error.config as AxiosRequestConfig | undefined)?.skipErrorToast;

    if (!error.response) {
      return Promise.reject(handleNoResponse(error, skipErrorToast));
    }

    const { status, data } = error.response;

    if (status === 401) {
      return Promise.reject(handleUnauthorizedError());
    }

    if (isTimeout(error)) {
      return Promise.reject(handleTimeout(error, skipErrorToast));
    }

    return Promise.reject(handleErrorResponse(status, data, error.message, skipErrorToast));
  },
);

function isTimeout(error: AxiosError): boolean {
  if (error.code === "ECONNABORTED") return true;
  const message = error.message?.toLowerCase() ?? "";
  if (message.includes("timeout")) return true;
  return message.includes("exceeded") && message.includes("timeout");
}

function handleNoResponse(error: AxiosError, skipErrorToast?: boolean): ApiError {
  const errorMessage = error.message ?? "";
  const errorCode = error.code ?? "";

  const lowered = errorMessage.toLowerCase();
  const isNetworkError =
    lowered.includes("network error") ||
    lowered.includes("cors") ||
    errorCode === "ERR_NETWORK" ||
    errorCode === "ERR_CORS" ||
    (!errorMessage && !errorCode);

  const message = isNetworkError
    ? "Network error. Please check your connection."
    : errorMessage || "Network error. Please check your connection.";

  Logger.error("Network error:", { message: errorMessage, code: errorCode });
  if (!skipErrorToast) {
    showToast({ value: message, variant: "error" });
  }

  return { status: 0, message, isNetworkError };
}

function isOnLoginPage(): boolean {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/login");
}

function handleUnauthorizedError(): ApiError {
  handleUnauthorized();
  const message = "Session expired. Please sign in again.";
  if (!isOnLoginPage()) {
    showToast({ value: message, variant: "error" });
  }
  return { status: 401, message };
}

function handleTimeout(error: AxiosError, skipErrorToast?: boolean): ApiError {
  Logger.error("Request timeout:", error.message);
  const message = "Request timed out";
  if (!skipErrorToast) {
    showToast({ value: message, variant: "error" });
  }
  return { status: 408, message };
}

function handleErrorResponse(
  status: number,
  data: unknown,
  fallbackMessage: string,
  skipErrorToast?: boolean,
): ApiError {
  const errorMessage = extractMessage(data) || fallbackMessage || "Something went wrong";

  if (!skipErrorToast) {
    showToast({ value: errorMessage, variant: "error" });
  }

  return { status, message: errorMessage, data: data ?? null };
}

function extractMessage(data: unknown): string | null {
  if (typeof data === "string") return data || null;
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  if (typeof record.message === "string" && record.message) {
    return record.message;
  }

  if (record.error && typeof record.error === "object") {
    const nested = (record.error as Record<string, unknown>).message;
    if (typeof nested === "string" && nested) return nested;
  }

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0] as Record<string, unknown> | undefined;
    if (first && typeof first.message === "string" && first.message) {
      return first.message;
    }
  }

  return null;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as ApiError).status === "number" &&
    typeof (error as ApiError).message === "string"
  );
}
