import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { PageIntro } from "@/components/site/page-intro";
import { studio } from "@/content/site";
import { isContactSubject } from "@/lib/contact/schema";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact and site visits",
  description:
    "Tell Atelier Barre about your plot and your project. We reply within two working days and site visits are free in Cotonou and Abomey-Calavi.",
  path: "/contact",
});

const nextSteps = [
  "We read your message and reply within two working days.",
  "We agree a date to walk your plot with you, free in Cotonou and Abomey-Calavi.",
  "You receive a written estimate and the soil test plan within a week of the visit.",
] as const;

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  // Links such as /contact?subject=site-visit pre-select the subject. Only
  // known values are accepted; anything else is ignored.
  const { subject } = await searchParams;
  const defaultSubject = isContactSubject(subject) ? subject : undefined;

  return (
    <>
      <PageIntro
        title="Tell us about your plot"
        lede="Where it is, what you want to build and roughly when. A few lines are enough to start; we ask the rest during the site visit."
      />

      <div className="shell grid gap-16 py-16 md:py-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] lg:gap-20">
        <section aria-labelledby="form-title">
          <h2 id="form-title" className="mb-8 text-[clamp(1.7rem,3vw,2.2rem)] leading-tight font-bold">
            Write to the studio
          </h2>
          <ContactForm defaultSubject={defaultSubject} />
        </section>

        <aside aria-label="Studio details" className="space-y-12">
          <section aria-labelledby="next-title">
            <h2 id="next-title" className="text-[1.5rem] leading-tight font-bold">
              What happens next
            </h2>
            <ol className="mt-5 space-y-5">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center bg-laterite font-display font-bold text-lime"
                  >
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="visit-title" className="border-t-4 border-kiln pt-6">
            <h2 id="visit-title" className="text-[1.5rem] leading-tight font-bold">
              Visit the studio
            </h2>
            <address className="mt-4 space-y-1 not-italic">
              <p>
                {studio.address.street}
                <br />
                {studio.address.city}, {studio.address.country}
              </p>
              <p className="pt-2">
                <a href={`tel:${studio.phone.href}`} className="text-link font-semibold">
                  {studio.phone.display}
                </a>
              </p>
              <p>
                <a href={`mailto:${studio.email}`} className="text-link break-all">
                  {studio.email}
                </a>
              </p>
            </address>
            <dl className="mt-6 space-y-2">
              {studio.hours.map((slot) => (
                <div key={slot.days}>
                  <dt className="font-semibold">{slot.days}</dt>
                  <dd className="text-dust">{slot.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-dust">{studio.yard}.</p>
          </section>
        </aside>
      </div>
    </>
  );
}
