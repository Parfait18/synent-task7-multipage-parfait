import type { Metadata } from "next";

import { ClosingCall } from "@/components/site/closing-call";
import { PageIntro } from "@/components/site/page-intro";
import { commitments, milestones, team } from "@/content/about";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About the studio",
  description:
    "An architect and a master mason started Atelier Barre in 2016 with one manual block press. Meet the team, the yard in Ouèdo and the rules we build by.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="An architect, a mason and a block press"
        lede="Atelier Barre started in 2016 with one manual press and a conviction: the soil under Cotonou is a better building material than the cement shipped in to cover it."
      />

      {/* Story: long-form text with a quote from the co-founder beside it. */}
      <section aria-labelledby="story-title">
        <div className="shell grid gap-12 py-20 md:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-20">
          <div className="prose-barre measure">
            <h2 id="story-title" className="mb-6 text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
              How it started
            </h2>
            <p>
              Rachida Adjovi came back to Cotonou after four years on earth-building sites in
              Ouagadougou. She found her clients asking for the same thing everywhere: a concrete
              house, then an air conditioner to make it liveable.
            </p>
            <p>
              Codjo Hounkpè had laid concrete blocks for thirty years and remembered the earth houses
              of his grandparents in Allada, cool at noon and never repainted. They bought a manual
              press, dug the laterite behind a plot in Calavi and built a first house to prove the
              point to themselves.
            </p>
            <p>
              Ten years later the press is hydraulic, the yard in Ouèdo makes two thousand blocks a
              day and the team designs and builds houses, shops and schools across the south of the
              country. The method has not changed: test the soil, shade the walls, let the air through.
            </p>
          </div>

          <figure className="self-start border-l-4 border-laterite pl-6 lg:mt-20">
            <blockquote className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-snug font-medium">
              <p>
                &ldquo;A wall does not need to be strong against people. It needs to be strong against
                the sun and the rain.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-4 text-dust">Codjo Hounkpè, master mason</figcaption>
          </figure>
        </div>
      </section>

      {/* Timeline: a real sequence, so years are shown in order with a joint between them. */}
      <section aria-labelledby="timeline-title" className="bg-plaster">
        <div className="shell py-20 md:py-24">
          <h2 id="timeline-title" className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
            Ten years, course by course
          </h2>
          <ol className="mt-12 grid gap-0 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <li key={milestone.year} className="border-t-2 border-laterite py-6 pr-8">
                <p className="font-display text-[2rem] leading-none font-bold text-laterite">
                  <time dateTime={String(milestone.year)}>{milestone.year}</time>
                </p>
                <p className="mt-3 max-w-xs">{milestone.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team: no portraits (the people are fictional), a monogram block instead. */}
      <section aria-labelledby="team-title">
        <div className="shell py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="team-title" className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
              Who you will meet on site
            </h2>
            <p className="max-w-sm text-dust">
              Four leads and a crew of fourteen masons, all employed by the studio.
            </p>
          </div>
          <ul className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
            {team.map((person) => (
              <li key={person.name} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="flex size-16 shrink-0 items-center justify-center bg-laterite font-display text-2xl font-bold text-lime"
                >
                  {person.initials}
                </span>
                <div>
                  <h3 className="text-[1.45rem] leading-tight font-semibold">{person.name}</h3>
                  <p className="text-laterite">{person.role}</p>
                  <p className="mt-2 max-w-md">{person.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Commitments: what the studio refuses to do, on the dark kiln surface. */}
      <section aria-labelledby="rules-title" className="on-dark bg-kiln text-lime">
        <div className="shell py-20 md:py-24">
          <h2 id="rules-title" className="text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight font-bold">
            Three rules we do not bend
          </h2>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/20">
            {commitments.map((rule) => (
              <li key={rule.title} className="md:px-8 md:first:pl-0">
                <h3 className="text-[1.4rem] leading-tight font-semibold text-harmattan">{rule.title}</h3>
                <p className="mt-3 text-[#d9cdc3]">{rule.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCall id="about-closing" />
    </>
  );
}
