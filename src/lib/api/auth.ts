import { APP_HOME_PATH } from "@/lib/app-home";
import { env } from "@/lib/env";
import { Logger } from "@/lib/logger";

export function buildGoogleAuthUrl(nextPath?: string | null): string {
  const destination = nextPath?.trim() || APP_HOME_PATH;
  const params = new URLSearchParams({ next: destination, app: "admin" });
  const prefix = env.BASE_URL.length > 0 ? env.BASE_URL : "";
  return `${prefix}/api/auth/google?${params.toString()}`;
}

export function handleUnauthorized(): void {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;
  if (pathname.startsWith("/login")) return;

  Logger.warn("Auth expired — redirecting to /login");
  const next = encodeURIComponent(`${pathname}${search}`);
  window.location.replace(`/login?next=${next}`);
}
