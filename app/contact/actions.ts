"use server";

import { headers } from "next/headers";

import { getClientKey } from "@/lib/contact/client-key";
import type { ContactFormState } from "@/lib/contact/form-state";
import { processContactSubmission } from "@/lib/contact/process-contact";
import { SlidingWindowRateLimiter } from "@/lib/contact/rate-limiter";

// Five messages per connection every ten minutes is plenty for a person and
// slows a script down. One limiter per server process (see rate-limiter.ts).
const contactRateLimiter = new SlidingWindowRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

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
  const requestHeaders = await headers();
  return processContactSubmission(formData, {
    clientKey: getClientKey(requestHeaders),
    rateLimiter: contactRateLimiter,
    logger: contactLogger,
  });
}
