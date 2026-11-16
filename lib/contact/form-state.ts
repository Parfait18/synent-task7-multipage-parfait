import type { ContactField } from "@/lib/contact/schema";

/**
 * What the contact Server Action returns to the form. Kept in its own module
 * so the Client Component can import the type and the initial value without
 * pulling the server-side processing code into the browser bundle.
 */
export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      reason: "invalid" | "rate-limited";
      message: string;
      fieldErrors: Partial<Record<ContactField, string>>;
      /**
       * What the visitor sent, returned so a page re-rendered without
       * JavaScript can refill the form instead of losing their text.
       */
      submittedValues?: Record<ContactField, string>;
    };

export const initialContactState: ContactFormState = { status: "idle" };
