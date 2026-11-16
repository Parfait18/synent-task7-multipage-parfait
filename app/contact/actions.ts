"use server";

import { headers } from "next/headers";

import { getClientKey, readClientKeyConfig, SHARED_CLIENT_KEY } from "@/lib/contact/client-key";
import type { ContactFormState } from "@/lib/contact/form-state";
import { processContactSubmission } from "@/lib/contact/process-contact";
import { SlidingWindowRateLimiter } from "@/lib/contact/rate-limiter";

const TEN_MINUTES = 10 * 60 * 1000;

// Five messages per visitor every ten minutes is plenty for a person and
// slows a script down. One limiter per server process (see rate-limiter.ts).
const perClientRateLimiter = new SlidingWindowRateLimiter({ limit: 5, windowMs: TEN_MINUTES });

// When no trusted source gives the visitor's IP, every request shares one key
// (see client-key.ts). That shared budget is larger, because it covers all
// visitors at once, but it cannot be bypassed by forging a header.
const sharedRateLimiter = new SlidingWindowRateLimiter({ limit: 20, windowMs: TEN_MINUTES });

// Read once at start-up: deployment settings, not per-request input.
const clientKeyConfig = readClientKeyConfig(process.env);

// Structured, single-line logs on stdout (12-factor). Only sanitised fields are passed in.
const contactLogger = {
  info: (message: string, details: Record<string, unknown>) =>
    console.info(JSON.stringify({ level: "info", message, ...details, at: new Date().toISOString() })),
  warn: (message: string, details: Record<string, unknown>) =>
    console.warn(JSON.stringify({ level: "warn", message, ...details, at: new Date().toISOString() })),
};

/**
 * Server Action behind the contact form. It is a public HTTP endpoint like
 * any other, so it re-validates everything with the shared zod schema rather
 * than trusting the browser.
 */
export async function submitContactRequest(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const clientKey = getClientKey(await headers(), clientKeyConfig);
  return processContactSubmission(formData, {
    clientKey,
    rateLimiter: clientKey === SHARED_CLIENT_KEY ? sharedRateLimiter : perClientRateLimiter,
    logger: contactLogger,
  });
}
