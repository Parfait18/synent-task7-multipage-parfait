import { Claustra } from "@/components/art/claustra";
import { CtaLink } from "@/components/site/cta-link";

/**
 * The call to book a site visit that closes the Home, About and Services
 * pages. Same message everywhere, so a visitor always knows the next step.
 */
export function ClosingCall({ id }: { id: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="on-dark relative overflow-hidden bg-laterite text-lime">
      <div className="shell relative z-10 grid gap-8 py-16 md:py-20 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2
            id={`${id}-title`}
            className="max-w-[20ch] text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-bold"
          >
            Building in the 2027 dry season?
          </h2>
          <p className="measure mt-4 text-[1.1rem] leading-relaxed">
            Site visits for next year&apos;s dry season start in January. Book one now and we will
            walk your plot with you before the calendar fills.
          </p>
        </div>
        <CtaLink href="/contact" variant="onDark" className="justify-self-start">
          Book a site visit
        </CtaLink>
      </div>
      {/* A claustra edge on the right, cut by the section: the wall continues off the page. */}
      <Claustra
        id={`${id}-claustra`}
        columns={3}
        courses={5}
        className="pointer-events-none absolute top-1/2 -right-16 hidden h-[130%] -translate-y-1/2 opacity-30 xl:block"
        lightClassName="fill-laterite"
        blockClassName="fill-laterite-deep"
      />
    </section>
  );
}
