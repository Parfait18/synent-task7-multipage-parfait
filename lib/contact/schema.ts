import { z } from "zod";

// zod 4 compiles fast parsers with `new Function` when it can. The site's CSP
// forbids eval, so the probe is reported as a violation in the browser. The
// jitless mode skips the probe; forms this small do not need the speed.
z.config({ jitless: true });

/**
 * The contact form contract, shared by the browser (instant feedback through
 * react-hook-form) and the Server Action (the actual security boundary).
 * One schema means the two can never drift apart.
 */

export const contactSubjects = [
  { value: "site-visit", label: "Book a site visit" },
  { value: "design", label: "Architecture and permits" },
  { value: "construction", label: "Construction" },
  { value: "blocks", label: "Order earth blocks" },
  { value: "retrofit", label: "Cooling retrofit" },
  { value: "other", label: "Something else" },
] as const;

export type ContactSubject = (typeof contactSubjects)[number]["value"];

const subjectValues = contactSubjects.map((subject) => subject.value) as [
  ContactSubject,
  ...ContactSubject[],
];

export const CONTACT_LIMITS = {
  nameMax: 80,
  emailMax: 254,
  messageMin: 20,
  messageMax: 2000,
} as const;

// Letters from any script (Adjovi, Hounkpè, Bio Sika…), spaces, apostrophes, dots and hyphens.
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;

// A phone number is optional. When given, it may start with + and contain
// spaces, dots or hyphens, and must hold 8 to 15 digits (E.164 maximum).
const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s.-]+$/;

export function isPlausiblePhone(value: string): boolean {
  if (!PHONE_ALLOWED_CHARACTERS.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 8 && digitCount <= 15;
}

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name, at least 2 characters.")
    .max(CONTACT_LIMITS.nameMax, `Keep your name under ${CONTACT_LIMITS.nameMax} characters.`)
    .regex(NAME_PATTERN, "Use letters, spaces, apostrophes or hyphens only."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address so we can reply.")
    .max(CONTACT_LIMITS.emailMax, "This email address is too long.")
    .pipe(z.email("Enter an email address like name@example.com.")),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || isPlausiblePhone(value), {
      message: "Enter a phone number with 8 to 15 digits, for example +229 01 97 00 00 00.",
    }),
  subject: z.enum(subjectValues, { error: "Choose what your message is about." }),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.messageMin,
      `Tell us a little more, at least ${CONTACT_LIMITS.messageMin} characters.`,
    )
    .max(
      CONTACT_LIMITS.messageMax,
      `Keep your message under ${CONTACT_LIMITS.messageMax} characters.`,
    ),
});

/** What the form holds while the visitor types. */
export type ContactFormValues = z.input<typeof contactSchema>;
/** What the server works with once the input is validated and trimmed. */
export type ContactRequest = z.output<typeof contactSchema>;
export type ContactField = keyof ContactFormValues;

export const contactFields = Object.keys(contactSchema.shape) as ContactField[];

export function isContactSubject(value: unknown): value is ContactSubject {
  return typeof value === "string" && subjectValues.includes(value as ContactSubject);
}

/** Name of the honeypot input. Humans never see it; naive bots fill it in. */
export const HONEYPOT_FIELD = "website";
