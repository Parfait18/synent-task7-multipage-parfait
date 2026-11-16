import type { Metadata } from "next";

import { ClaustraBlock } from "@/components/art/claustra";
import { ClosingCall } from "@/components/site/closing-call";
import { PageIntro } from "@/components/site/page-intro";
import { faqs, processSteps, services } from "@/content/services";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Services and prices",
  description:
    "Architecture and permits, construction, compressed earth blocks and cooling retrofits for concrete houses. What each service includes, how long it takes and what it costs.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        title="From the soil test to the keys"
        lede="Take one service or all four. Every price below is a starting point; you get a fixed quote after the site visit, before you commit to anything."
      >
        {/* In-page index: four services, one click away. */}
        <nav aria-label="Services on this page" className="lg:pb-2">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {services.map((service) => (
              <li key={service.slug}>
                <a
                  href={`#${service.slug}`}
                  className="inline-flex items-center gap-2.5 rounded-sm border border-joint px-3 py-2 text-[0.98rem] font-medium hover:border-laterite hover:text-laterite lg:border-0 lg:px-0 lg:py-1"
                >
                  <ClaustraBlock className="size-3.5 shrink-0 text-laterite" />
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      {/* Services: one row each, scope on the left, the practical facts on the right. */}
      <div>
        {services.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-title`}
            className={index % 2 === 1 ? "bg-plaster" : undefined}
          >
            <div className="shell grid gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-20">
              <div>
                <h2
                  id={`${service.slug}-title`}
                  className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold"
                >
                  {service.name}
                </h2>
                <p className="measure mt-4 text-[1.15rem] leading-relaxed">{service.summary}</p>
                <h3 className="mt-8 font-body text-[1rem] font-bold">What is included</h3>
                <ul className="mt-3 space-y-2.5">
                  {service.included.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 bg-laterite" />
                      <span className="measure">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="self-start border-t-4 border-kiln pt-5">
                <div className="pb-5">
                  <dt className="text-dust">For</dt>
                  <dd className="mt-1">{service.forWhom}</dd>
                </div>
                <div className="border-t border-joint/40 py-5">
                  <dt className="text-dust">Typical duration</dt>
                  <dd className="mt-1 font-display text-[1.5rem] font-semibold">{service.duration}</dd>
                </div>
                <div className="border-t border-joint/40 pt-5">
                  <dt className="text-dust">Price</dt>
                  <dd className="mt-1 font-display text-[1.5rem] font-semibold text-laterite">
                    {service.priceFrom}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        ))}
      </div>

      {/* Process: the order of work is a true sequence, so the steps are numbered. */}
      <section aria-labelledby="process-title" className="on-dark bg-kiln text-lime">
        <div className="shell py-20 md:py-24">
          <h2 id="process-title" className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
            How a project runs
          </h2>
          <p className="measure mt-4 text-[#d9cdc3]">
            The same five stages for a house, a shop or a school. You approve each one before the next
            begins.
          </p>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-harmattan pt-4">
                <span aria-hidden="true" className="font-display text-[2.25rem] leading-none font-bold text-harmattan">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-[1.3rem] leading-tight font-semibold">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.98rem] text-[#d9cdc3]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Questions: native details/summary, keyboard and screen reader friendly without JavaScript. */}
      <section aria-labelledby="faq-title">
        <div className="shell grid gap-10 py-20 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
          <h2 id="faq-title" className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
            Questions we hear on every site visit
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-[1.3rem] leading-snug font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-laterite after:absolute after:top-0 after:left-1/2 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-laterite after:transition-transform group-open:after:scale-y-0"
                  />
                </summary>
                <p className="measure pb-5">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ClosingCall id="services-closing" />
    </>
  );
}
