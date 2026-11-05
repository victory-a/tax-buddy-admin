import { toast } from "sonner";

/**
 * Thin wrapper around `sonner` that gives us a single, stable call site
 * (`showToast({ value, variant })`) — the axios response interceptor and
 * any future caller go through this, not sonner directly. That way:
 *
 *  - swapping the underlying library is a one-file change,
 *  - the variant vocabulary stays domain-shaped (`success | error | info`),
 *  - non-React modules (like `client.ts`) don't import a JSX-flavoured API.
 *
 * The actual `<Toaster />` component (which mounts sonner's renderer with
 * our design tokens) lives in `src/components/ui/toaster.tsx`.
 */

export type ToastVariant = "success" | "error" | "info";

export interface ToastInput {
  /** Body of the toast. */
  value: string;
  /** Visual treatment. Defaults to `"info"`. */
  variant?: ToastVariant;
  /** Auto-dismiss after N milliseconds. Falls through to sonner's default if omitted. */
  duration?: number;
  /** Stable id — passing the same id replaces the existing toast. */
  id?: string | number;
  /** Optional secondary line under the title. */
  description?: string;
}

export type ToastId = string | number;

export function showToast(input: ToastInput): ToastId {
  const variant = input.variant ?? "info";
  const options = {
    id: input.id,
    duration: input.duration,
    description: input.description,
  };

  switch (variant) {
    case "success":
      return toast.success(input.value, options);
    case "error":
      return toast.error(input.value, options);
    case "info":
    default:
      return toast(input.value, options);
  }
}

export function dismissToast(id?: ToastId): void {
  toast.dismiss(id);
}

export function clearToasts(): void {
  toast.dismiss();
}
