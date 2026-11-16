import { describe, expect, it, vi } from "vitest";

import { processContactSubmission, SUCCESS_MESSAGE } from "@/lib/contact/process-contact";
import { SlidingWindowRateLimiter } from "@/lib/contact/rate-limiter";

const MESSAGE = "Our concrete house in Fidjrossè is too hot in the afternoon.";

function buildFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    name: "Akouavi Hounsa",
    email: "Akouavi@Example.com",
    phone: "+229 01 97 00 00 00",
    subject: "retrofit",
    message: MESSAGE,
    website: "",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

function createDependencies(limit = 5) {
  return {
    clientKey: "203.0.113.7",
    rateLimiter: new SlidingWindowRateLimiter({ limit, windowMs: 60_000 }),
    logger: { info: vi.fn(), warn: vi.fn() },
  };
}

describe("processContactSubmission", () => {
  it("should return success and log a sanitised summary when the request is valid", async () => {
    const dependencies = createDependencies();
    const state = await processContactSubmission(buildFormData(), dependencies);

    expect(state).toEqual({ status: "success", message: SUCCESS_MESSAGE });
    expect(dependencies.logger.info).toHaveBeenCalledWith("contact.request_received", {
      subject: "retrofit",
      emailDomain: "example.com",
      hasPhone: true,
      messageLength: MESSAGE.length,
    });
  });

  it("should never write the name, email or message text to the logs", async () => {
    const dependencies = createDependencies();
    await processContactSubmission(buildFormData(), dependencies);

    const logged = JSON.stringify(dependencies.logger.info.mock.calls);
    expect(logged).not.toContain("Akouavi");
    expect(logged).not.toContain("Fidjrossè");
  });

  it("should return one error per invalid field when validation fails", async () => {
    const state = await processContactSubmission(
      buildFormData({ name: "", email: "not-an-email", subject: "loan" }),
      createDependencies(),
    );

    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.reason).toBe("invalid");
    expect(Object.keys(state.fieldErrors).sort()).toEqual(["email", "name", "subject"]);
    expect(state.fieldErrors.name).toBe("Enter your name, at least 2 characters.");
    expect(state.submittedValues?.email).toBe("not-an-email");
  });

  it("should treat a missing or non-text field as empty instead of crashing", async () => {
    const formData = buildFormData();
    formData.delete("email");
    formData.set("message", new Blob(["binary"]));
    const state = await processContactSubmission(formData, createDependencies());

    expect(state.status === "error" && Object.keys(state.fieldErrors).sort()).toEqual(["email", "message"]);
  });

  it("should pretend to succeed but drop the request when the honeypot is filled", async () => {
    const dependencies = createDependencies();
    const state = await processContactSubmission(
      buildFormData({ website: "https://spam.example" }),
      dependencies,
    );

    expect(state).toEqual({ status: "success", message: SUCCESS_MESSAGE });
    expect(dependencies.logger.info).not.toHaveBeenCalled();
    expect(dependencies.logger.warn).toHaveBeenCalledWith("contact.honeypot_triggered", {});
  });

  it("should refuse the request without validating it when the sender is rate limited", async () => {
    const dependencies = createDependencies(1);
    await processContactSubmission(buildFormData(), dependencies);
    const state = await processContactSubmission(buildFormData(), dependencies);

    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.reason).toBe("rate-limited");
    expect(state.message).toMatch(/Try again in 1 minute,/);
    expect(dependencies.logger.info).toHaveBeenCalledTimes(1);
  });
});
