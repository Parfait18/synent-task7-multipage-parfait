import type { Metadata } from "next";
import Link from "next/link";

import { Claustra, ClaustraBlock } from "@/components/art/claustra";
import { Elevation } from "@/components/art/elevation";
import { ClosingCall } from "@/components/site/closing-call";
import { CtaLink } from "@/components/site/cta-link";
import { featuredProjects } from "@/content/projects";
import { studio } from "@/content/site";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Houses built from the red earth they stand on",
    description: studio.description,
    path: "/",
  }),
  // The home page uses the studio's full name and tagline, not the "… | Atelier Barre" template.
  title: { absolute: `${studio.name}, ${studio.tagline.toLowerCase()}` },
};

const reasons = [
  {
    title: "Cooler without air conditioning",
    text: "A 30 cm earth wall soaks up the afternoon heat and gives it back after dark, when the windows are open. Rooms stay noticeably cooler than behind a hollow concrete block.",
    fact: "Thermal mass, shade and cross ventilation, designed in from the first sketch.",
  },
  {
    title: "Pressed twenty kilometres away",
    text: "The laterite is dug and pressed at our yard in Ouèdo. The blocks are not fired, and they need about a third of the cement of a concrete block.",
    fact: "Less cement to import, less money leaving the region.",
  },
  {
    title: "Repaired by any mason",
    text: "There is no secret in an earth wall. We train local masons on every site, so the person who fixes your wall in ten years lives down the road.",
    fact: "More than forty masons trained since 2020.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero: the headline is laid like a running bond; the claustra is the one animated element. */}
      <section aria-labelledby="hero-title" className="overflow-hidden border-b border-border">
        <div className="shell grid items-center gap-12 pt-12 pb-16 md:pt-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16 lg:pt-20 lg:pb-24">
          <div>
            <h1
              id="hero-title"
              className="text-[clamp(2.1rem,9vw,4.4rem)] leading-[1.02] font-bold tracking-[-0.02em]"
            >
              <span className="bond-line">Houses built</span>
              <span className="bond-line">from the red earth</span>
              <span className="bond-line">they stand on.</span>
            </h1>
            <p className="measure mt-8 text-[1.2rem] leading-relaxed text-dust">
              {studio.name} designs and builds homes, shops and schools in southern Benin with
              compressed earth blocks pressed from local laterite, the{" "}
              <span lang="fr">terre de barre</span> that gives Cotonou its red roads.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <CtaLink href="/contact?subject=site-visit">Book a site visit</CtaLink>
              <CtaLink href="/services" variant="secondary">
                See our services
              </CtaLink>
            </div>
          </div>

          <figure className="w-full max-w-[19rem] sm:max-w-sm lg:max-w-none">
            <Claustra
              id="hero-claustra"
              columns={4}
              courses={5}
              isAnimated
              hasDepth
              className="block h-auto w-full"
            />
            <figcaption className="mt-4 text-[0.95rem] text-dust">
              A claustra screen: blocks pressed at our Ouèdo yard, laid so the wind passes through
              and the sun does not.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Why earth: three reasons, read as a list rather than as cards. */}
      <section aria-labelledby="why-title" className="bg-plaster">
        <div className="shell grid gap-12 py-20 md:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
          <div>
            <h2 id="why-title" className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold">
              Why we build in earth
            </h2>
            <p className="mt-4 max-w-xs text-dust">
              Concrete is fast. Earth is better at the one thing a house in Cotonou has to do: keep
              the heat out.
            </p>
          </div>
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {reasons.map((reason) => (
              <li key={reason.title} className="border-t-4 border-laterite pt-5">
                <h3 className="text-[1.45rem] leading-tight font-semibold">{reason.title}</h3>
                <p className="mt-3">{reason.text}</p>
                <p className="mt-4 text-[0.95rem] text-dust">{reason.fact}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent work: each project as a drawn elevation with its facts beside it. */}
      <section aria-labelledby="work-title">
        <div className="shell py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="work-title" className="text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-bold">
              Recent work
            </h2>
            <p className="max-w-sm text-dust">
              Thirty-one buildings since 2016. Here are three of them, drawn from the street.
            </p>
          </div>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {featuredProjects.map((project) => (
              <li
                key={project.name}
                className="grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12"
              >
                <Elevation kind={project.kind} className="w-full max-w-md bg-plaster p-4" />
                <div>
                  <h3 className="text-[1.75rem] leading-tight font-semibold">{project.name}</h3>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[0.98rem]">
                    <dt className="text-dust">Where</dt>
                    <dd>{project.place}</dd>
                    <dt className="text-dust">Completed</dt>
                    <dd>{project.year}</dd>
                    <dt className="text-dust">Programme</dt>
                    <dd>{project.programme}</dd>
                    <dt className="text-dust">Floor area</dt>
                    <dd>{project.floorArea}</dd>
                  </dl>
                  <p className="measure mt-5">{project.story}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 flex items-center gap-3">
            <ClaustraBlock className="size-4 shrink-0 text-laterite" />
            <Link href="/about" className="text-link font-semibold">
              Meet the people who build them
            </Link>
          </p>
        </div>
      </section>

      <ClosingCall id="home-closing" />
    </>
  );
}
