/**
 * Typed environment configuration.
 *
 * The single source of `process.env` access for the frontend. Every other
 * module imports `env` from here and never reaches into `process.env`
 * directly — that way:
 *
 *  1. We get one place to validate required vars at startup.
 *  2. Callers stay typed: `env.BASE_URL` is `string`, never `string | undefined`.
 *  3. Renaming or adding env vars is a one-file change.
 *
 * Next.js inlines `NEXT_PUBLIC_*` vars into the client bundle at build time,
 * so this module is safe to import from server components, client components,
 * and non-React modules (e.g. the axios interceptor).
 */

type NodeEnv = "development" | "production" | "test";

const NODE_ENV = (process.env.NODE_ENV ?? "development") as NodeEnv;
const IS_PRODUCTION = NODE_ENV === "production";
const IS_DEVELOPMENT = NODE_ENV === "development";
const IS_TEST = NODE_ENV === "test";

/**
 * Read a required env var.
 *
 * @param name      Variable name, used in the error message.
 * @param value     Raw value from `process.env`.
 * @param fallback  Optional fallback used in non-production environments.
 *                  In production, a missing required var always throws.
 */
function requireEnv(
  name: string,
  value: string | undefined,
  fallback?: string,
): string {
  if (value && value.length > 0) return value;

  if (!IS_PRODUCTION && fallback !== undefined) {
    return fallback;
  }

  throw new Error(
    `Missing required environment variable: ${name}. ` +
    `Set it in .env.local (see .env.example).`,
  );
}

/** Strip a single trailing slash so callers can append paths cleanly. */
function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

const BACKEND_URL = trimTrailingSlash(
  requireEnv(
    "NEXT_PUBLIC_API_URL",
    process.env.NEXT_PUBLIC_API_URL,
    "http://localhost:8080",
  ),
);

/**
 * When true, the browser talks to `/api` on the frontend origin (proxied to the
 * backend via `next.config.ts`). Session cookies then land on the same host as
 * the UI, which Chrome and Brave require for credentialed requests.
 */
const USE_SAME_ORIGIN_API =
  process.env.NEXT_PUBLIC_USE_SAME_ORIGIN_API !== "false" && IS_DEVELOPMENT;

/** Empty string means same-origin `/api` (see `USE_SAME_ORIGIN_API`). */
const BASE_URL = USE_SAME_ORIGIN_API ? "" : BACKEND_URL;

/**
 * Strongly-typed environment for the frontend. Add new public vars here
 * (and in `.env.local.template`) — never read `process.env` directly.
 */
export const env = {
  /** API base for browser requests. Empty = same-origin `/api` proxy in dev. */
  BASE_URL,
  /** Backend URL used by Next.js rewrites (not for direct browser calls in dev). */
  BACKEND_URL,
  USE_SAME_ORIGIN_API,
  /** Current Node environment as a narrowed union. */
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
} as const;

export type Env = typeof env;
