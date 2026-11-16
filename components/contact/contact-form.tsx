"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { submitContactRequest } from "@/app/contact/actions";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { initialContactState } from "@/lib/contact/form-state";
import {
  CONTACT_LIMITS,
  contactFields,
  contactSchema,
  contactSubjects,
  HONEYPOT_FIELD,
  isContactSubject,
  type ContactField,
  type ContactFormValues,
  type ContactRequest,
  type ContactSubject,
} from "@/lib/contact/schema";

const inputClassName = "h-12 bg-card px-3.5 text-base md:text-base";

/**
 * Contact form. react-hook-form validates with the shared zod schema as the
 * visitor types; the Server Action validates again on submit. Without
 * JavaScript the form still posts to the same action (progressive
 * enhancement) and shows the errors the server returns.
 */
export function ContactForm({ defaultSubject }: { defaultSubject?: ContactSubject }) {
  const [serverState, submitAction, isPending] = useActionState(
    submitContactRequest,
    initialContactState,
  );
  const statusRef = useRef<HTMLDivElement>(null);

  const form = useForm<ContactFormValues, unknown, ContactRequest>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    // Without JavaScript, the server's answer re-renders this component: refill what was sent.
    defaultValues:
      serverState.status === "error" && serverState.submittedValues
        ? {
            ...serverState.submittedValues,
            subject: isContactSubject(serverState.submittedValues.subject)
              ? serverState.submittedValues.subject
              : undefined,
          }
        : { name: "", email: "", phone: "", subject: defaultSubject, message: "" },
  });

  // React to the server's answer: show its field errors on the fields, or
  // clear the form after a success, then move focus to the status message so
  // keyboard and screen reader users hear the outcome.
  useEffect(() => {
    if (serverState.status === "idle") return;
    if (serverState.status === "error") {
      for (const [field, message] of Object.entries(serverState.fieldErrors)) {
        form.setError(field as ContactField, { type: "server", message });
      }
    }
    if (serverState.status === "success") {
      form.reset({ name: "", email: "", phone: "", subject: undefined, message: "" });
    }
    statusRef.current?.focus();
  }, [serverState, form]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // The honeypot is not part of the react-hook-form values: read it from the DOM form.
    const honeypotValue = new FormData(event.currentTarget).get(HONEYPOT_FIELD);
    // handleSubmit prevents the native post, validates, then calls back only when valid.
    return form.handleSubmit((values) => {
      const formData = new FormData();
      for (const field of contactFields) formData.set(field, values[field]);
      formData.set(HONEYPOT_FIELD, typeof honeypotValue === "string" ? honeypotValue : "");
      startTransition(() => submitAction(formData));
    })(event);
  }

  // Without JavaScript the page is re-rendered from the server's answer and
  // react-hook-form has not submitted anything, so the server's field errors
  // are shown directly. With JavaScript they arrive through setError above.
  const isClientSubmitted = form.formState.isSubmitted;
  const serverFieldError = (field: ContactField) =>
    !isClientSubmitted && serverState.status === "error" ? serverState.fieldErrors[field] : undefined;

  const messageLength = useWatch({ control: form.control, name: "message" })?.length ?? 0;

  return (
    <form
      action={submitAction}
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="contact-form-note"
      className="relative"
    >
      <div
        ref={statusRef}
        tabIndex={-1}
        role={serverState.status === "error" ? "alert" : "status"}
        aria-live={serverState.status === "error" ? "assertive" : "polite"}
        className="outline-none focus-visible:outline-3 focus-visible:outline-laterite"
      >
        {serverState.status === "success" && (
          <div className="mb-8 flex gap-3 border-l-4 border-neem bg-card p-5">
            <CheckIcon className="mt-0.5 size-5 shrink-0 text-neem" aria-hidden="true" />
            <p className="font-medium text-neem">{serverState.message}</p>
          </div>
        )}
        {serverState.status === "error" && (
          <p className="mb-8 border-l-4 border-signal bg-card p-5 font-medium text-signal">
            {serverState.message}
          </p>
        )}
      </div>

      <FieldGroup className="gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => {
              const error = fieldState.error?.message ?? serverFieldError("name");
              return (
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
                  <Input
                    {...field}
                    id="contact-name"
                    autoComplete="name"
                    maxLength={CONTACT_LIMITS.nameMax}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "contact-name-error" : undefined}
                    className={inputClassName}
                  />
                  {error && <FieldError id="contact-name-error">{error}</FieldError>}
                </Field>
              );
            }}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => {
              const error = fieldState.error?.message ?? serverFieldError("email");
              return (
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="contact-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.emailMax}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "contact-email-error" : undefined}
                    className={inputClassName}
                  />
                  {error && <FieldError id="contact-email-error">{error}</FieldError>}
                </Field>
              );
            }}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => {
              const error = fieldState.error?.message ?? serverFieldError("phone");
              return (
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="contact-phone">
                    Phone <span className="font-normal text-dust">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={24}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "contact-phone-error" : "contact-phone-hint"}
                    className={inputClassName}
                  />
                  {error ? (
                    <FieldError id="contact-phone-error">{error}</FieldError>
                  ) : (
                    <FieldDescription id="contact-phone-hint">
                      We call back on weekdays, 8:00 to 17:30.
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          />

          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => {
              const error = fieldState.error?.message ?? serverFieldError("subject");
              return (
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="contact-subject"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "contact-subject-error" : undefined}
                      className="h-12! w-full bg-card px-3.5 text-base"
                    >
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-card">
                      {contactSubjects.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value} className="py-2.5 text-base">
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && <FieldError id="contact-subject-error">{error}</FieldError>}
                </Field>
              );
            }}
          />
        </div>

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => {
            const error = fieldState.error?.message ?? serverFieldError("message");
            return (
              <Field data-invalid={Boolean(error)}>
                <FieldLabel htmlFor="contact-message">Your project</FieldLabel>
                <Textarea
                  {...field}
                  id="contact-message"
                  rows={7}
                  maxLength={CONTACT_LIMITS.messageMax}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`contact-message-hint${error ? " contact-message-error" : ""}`}
                  className="min-h-44 bg-card px-3.5 py-3 text-base md:text-base"
                />
                <FieldDescription id="contact-message-hint" className="flex justify-between gap-4">
                  <span>Where is the plot, what do you want to build, and when?</span>
                  <span className="shrink-0 tabular-nums" aria-hidden="true">
                    {messageLength}/{CONTACT_LIMITS.messageMax}
                  </span>
                </FieldDescription>
                {error && <FieldError id="contact-message-error">{error}</FieldError>}
              </Field>
            );
          }}
        />

        {/*
          Honeypot: hidden from sight, from assistive technology and from the
          tab order. People leave it empty; form-filling bots do not.
        */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-12 items-center justify-center rounded-sm bg-laterite px-7 text-[1.02rem] font-semibold text-lime transition-colors hover:bg-laterite-deep disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? "Sending…" : "Send message"}
          </button>
          <p id="contact-form-note" className="text-[0.95rem] text-dust">
            All fields are required except the phone number.
          </p>
        </div>
      </FieldGroup>
    </form>
  );
}
