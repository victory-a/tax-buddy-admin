import { env } from "@/lib/env";

/**
 * Thin client-side logger. Wraps `console.*` so we can silence (or rewire)
 * non-error logs in production without touching call sites.
 *
 *  - `Logger.error(...)` always runs — errors are useful in every environment
 *    and surface in the browser console / Sentry / etc.
 *  - `Logger.warn(...)`, `Logger.info(...)`, `Logger.debug(...)` are silenced
 *    in production builds. Use these freely during development.
 *
 * Never log sensitive payloads (auth tokens, full transactions). Prefer
 * `Logger.debug("Loaded transactions", { count: data.length })` over
 * dumping the raw response.
 */
type LogArgs = readonly unknown[];

interface LoggerApi {
  error: (...args: LogArgs) => void;
  warn: (...args: LogArgs) => void;
  info: (...args: LogArgs) => void;
  debug: (...args: LogArgs) => void;
}

const noop = () => {};

export const Logger: LoggerApi = {
  error: (...args) => console.error(...args),
  warn: env.IS_PRODUCTION ? noop : (...args) => console.warn(...args),
  info: env.IS_PRODUCTION ? noop : (...args) => console.info(...args),
  debug: env.IS_PRODUCTION ? noop : (...args) => console.debug(...args),
};
