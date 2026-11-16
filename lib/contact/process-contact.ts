import type { ContactFormState } from "@/lib/contact/form-state";
import type { RateLimitResult } from "@/lib/contact/rate-limiter";
import {
  CONTACT_LIMITS,
  contactFields,
  contactSchema,
  HONEYPOT_FIELD,
  type ContactField,
  type ContactRequest,
} from "@/lib/contact/schema";

/**
 * Server-side handling of a contact request, kept free of Next.js APIs so it
 * can be unit tested. The Server Action in app/contact/actions.ts only
 * gathers the request context and calls this function.
 */

export type ContactLogger = {
  info: (message: string, details: Record<string, unknown>) => void;
  warn: (message: string, details: Record<string, unknown>) => void;
};

export type ContactDependencies = {
  /** Identifies the sender for rate limiting (an IP address in production). */
  clientKey: string;
  rateLimiter: { consume: (key: string) => RateLimitResult };
  logger: ContactLogger;
};

export const SUCCESS_MESSAGE =
  "Message sent. We reply within two working days, by email or by phone if you left a number.";

/** Reads a text field; anything else (a file, a missing field) becomes an empty string. */
function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/**
 * A summary that is safe to write to server logs: no name, no message text,
 * no full email address. Enough to see that requests arrive and what they
 * are about, without turning logs into a store of personal data.
 */
export function summariseContactRequest(request: ContactRequest) {
  return {
    subject: request.subject,
    emailDomain: request.email.split("@").pop()?.toLowerCase() ?? "unknown",
    hasPhone: request.phone !== "",
    messageLength: request.message.length,
  };
}

export async function processContactSubmission(
  formData: FormData,
  { clientKey, rateLimiter, logger }: ContactDependencies,
): Promise<ContactFormState> {
  const rateLimit = rateLimiter.consume(clientKey);
  if (!rateLimit.isAllowed) {
    logger.warn("contact.rate_limited", { retryAfterSeconds: rateLimit.retryAfterSeconds });
    const minutes = Math.ceil(rateLimit.retryAfterSeconds / 60);
    return {
      status: "error",
      reason: "rate-limited",
      message: `Too many messages from this connection. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}, or call the studio.`,
      fieldErrors: {},
    };
  }

  // A filled honeypot means a bot. Answer as if it worked so the bot learns
  // nothing, and drop the request.
  if (readText(formData, HONEYPOT_FIELD).trim() !== "") {
    logger.warn("contact.honeypot_triggered", {});
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const rawInput = Object.fromEntries(
    contactFields.map((field) => [field, readText(formData, field)]),
  ) as Record<ContactField, string>;
  const parsed = contactSchema.safeParse(rawInput);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      // Keep the first message per field: it is the one to fix first.
      fieldErrors[field] ??= issue.message;
    }
    return {
      status: "error",
      reason: "invalid",
      message: "Some fields need attention. Check the messages under each field.",
      fieldErrors,
      // Capped so an oversized request is not echoed back in full.
      submittedValues: Object.fromEntries(
        contactFields.map((field) => [field, rawInput[field].slice(0, CONTACT_LIMITS.messageMax)]),
      ) as Record<ContactField, string>,
    };
  }

  // No email service is connected (the business is fictional): the request
  // is acknowledged and a sanitised summary is logged. A real deployment
  // would hand `parsed.data` to a mail or CRM adapter here.
  logger.info("contact.request_received", summariseContactRequest(parsed.data));
  return { status: "success", message: SUCCESS_MESSAGE };
}
