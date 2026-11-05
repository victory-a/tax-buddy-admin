"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { GuestGuard } from "@/components/auth/guest-guard";
import { buildGoogleAuthUrl } from "@/lib/api/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-5 shrink-0", className)}>
      <path
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.891-1.741 2.981-4.305 2.981-7.351z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.422l-3.232-2.51c-.896.6-2.041.955-3.387.955-2.605 0-4.81-1.76-5.596-4.122H3.064v2.59A9.997 9.997 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.404 13.901A6.013 6.013 0 0 1 6.09 12c0-.66.114-1.302.314-1.901V7.51H3.064A9.997 9.997 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49l3.34-2.589z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.977c1.471 0 2.79.506 3.83 1.498l2.866-2.866C16.96 2.99 14.696 2 12 2 8.092 2 4.71 4.245 3.064 7.51l3.34 2.59C7.19 7.736 9.395 5.977 12 5.977z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginSkeleton />}>
      <GuestGuard>
        <LoginContent />
      </GuestGuard>
    </React.Suspense>
  );
}

function LoginSkeleton() {
  return (
    <main className="flex-1 w-full flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md h-[320px] rounded-2xl border border-outline-variant/60 bg-surface-container-lowest animate-pulse" />
    </main>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const error = searchParams.get("error");
  const googleAuthHref = buildGoogleAuthUrl(next);

  return (
    <main className="flex-1 w-full flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md flex flex-col gap-6 p-8 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-elevated">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary text-body-sm font-semibold"
          >
            tb
          </span>
          <div>
            <span className="block font-display text-headline-sm tracking-tight text-on-surface">
              tax-buddy
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              admin
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl tracking-tight text-on-surface">Staff sign-in</h1>
          <p className="text-body-md text-on-surface-variant">
            Continue with a Google account that will be allowlisted for admin access.
          </p>
          {error === "google_unverified" ? (
            <p className="text-body-sm text-error" role="alert">
              Your Google account does not have a verified email. Use a verified account to sign in.
            </p>
          ) : null}
          {error === "google" ? (
            <p className="text-body-sm text-error" role="alert">
              Google sign-in failed. Please try again.
            </p>
          ) : null}
        </div>

        <a
          href={googleAuthHref}
          className={cn(buttonVariants({ variant: "outlined", size: "lg" }), "w-full justify-center no-underline")}
        >
          <GoogleIcon />
          Continue with Google
        </a>
      </div>
    </main>
  );
}
