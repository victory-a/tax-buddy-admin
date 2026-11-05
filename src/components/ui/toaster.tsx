"use client";

import { Toaster as SonnerToaster, type ToasterProps as SonnerToasterProps } from "sonner";

/**
 * Thin wrapper around sonner's `<Toaster />` configured to match our
 * design tokens. Mount once near the root (in `app/layout.tsx`) — calls
 * to `showToast(...)` from anywhere in the client bundle render here.
 *
 * We rely on sonner's CSS variable hooks (`--normal-bg`, `--success-bg`, …)
 * so each variant lifts directly off our `@theme` palette.
 */

export type ToasterPosition = NonNullable<SonnerToasterProps["position"]>;

export interface ToasterProps {
  /** Where toasts appear on the screen. Defaults to `"top-right"`. */
  position?: ToasterPosition;
}

export function Toaster({ position = "top-right" }: ToasterProps = {}) {
  return (
    <SonnerToaster
      position={position}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: [
            "font-sans text-body-md rounded-md border shadow-elevated",
            "px-3 py-3",
          ].join(" "),
          title: "font-sans text-body-md font-medium",
          description: "text-body-sm text-on-surface-variant",
          actionButton: "rounded text-body-sm",
          cancelButton: "rounded text-body-sm",
          closeButton: "rounded",
        },
      }}
      style={
        {
          // Default ("info") variant — dark, premium look.
          "--normal-bg": "var(--color-inverse-surface)",
          "--normal-border": "var(--color-inverse-surface)",
          "--normal-text": "var(--color-inverse-on-surface)",
          // success
          "--success-bg": "var(--color-secondary-container)",
          "--success-border": "var(--color-secondary-container)",
          "--success-text": "var(--color-on-secondary-container)",
          // error
          "--error-bg": "var(--color-error-container)",
          "--error-border": "var(--color-error-container)",
          "--error-text": "var(--color-on-error-container)",
        } as React.CSSProperties
      }
    />
  );
}
