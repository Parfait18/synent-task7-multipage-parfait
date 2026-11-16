import { describe, expect, it } from "vitest";

import { contactSchema, isContactSubject, isPlausiblePhone } from "@/lib/contact/schema";

const validInput = {
  name: "Akouavi Hounsa",
  email: "akouavi@example.com",
  phone: "",
  subject: "site-visit",
  message: "We own a 400 m² plot in Togba and want a three-bedroom house.",
};

describe("contactSchema", () => {
  it("should accept a complete request and trim the values", () => {
    const result = contactSchema.safeParse({ ...validInput, name: "  Akouavi Hounsa  " });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Akouavi Hounsa");
  });

  it("should accept names with accents and apostrophes when they are written in any script", () => {
    for (const name of ["Codjo Hounkpè", "Ismaël Bio Sika", "N'Dah Adé-Sossou"]) {
      expect(contactSchema.safeParse({ ...validInput, name }).success).toBe(true);
    }
  });

  it("should reject a name containing markup or digits", () => {
    for (const name of ["<script>", "R2D2"]) {
      const result = contactSchema.safeParse({ ...validInput, name });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(["name"]);
    }
  });

  it("should reject an email address without a domain", () => {
    const result = contactSchema.safeParse({ ...validInput, email: "akouavi@" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/email address like/);
  });

  it("should reject a subject that is not in the list", () => {
    const result = contactSchema.safeParse({ ...validInput, subject: "loan" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Choose what your message is about.");
  });

  it("should reject a message that is too short or too long", () => {
    expect(contactSchema.safeParse({ ...validInput, message: "Hello" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validInput, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("should count a message's length after trimming spaces", () => {
    const padded = `   ${"a".repeat(19)}   `;
    expect(contactSchema.safeParse({ ...validInput, message: padded }).success).toBe(false);
  });

  it("should accept an empty phone number because the field is optional", () => {
    expect(contactSchema.safeParse({ ...validInput, phone: "   " }).success).toBe(true);
  });
});

describe("isPlausiblePhone", () => {
  it("should accept Benin and international formats when they hold 8 to 15 digits", () => {
    for (const phone of ["+229 01 97 00 00 00", "0197000000", "+33 6 12 34 56 78", "97-00-00-00"]) {
      expect(isPlausiblePhone(phone)).toBe(true);
    }
  });

  it("should reject letters, too few digits and too many digits", () => {
    for (const phone of ["call me", "1234567", "+1234567890123456"]) {
      expect(isPlausiblePhone(phone)).toBe(false);
    }
  });
});

describe("isContactSubject", () => {
  it("should recognise only the listed subjects", () => {
    expect(isContactSubject("retrofit")).toBe(true);
    expect(isContactSubject("Retrofit")).toBe(false);
    expect(isContactSubject(["retrofit"])).toBe(false);
    expect(isContactSubject(undefined)).toBe(false);
  });
});
