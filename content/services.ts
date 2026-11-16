/**
 * The studio's services, their scope and indicative prices.
 * Prices are illustrative (the business is fictional) and expressed in
 * West African CFA francs, the currency used in Benin.
 */
export type Service = {
  slug: string;
  name: string;
  summary: string;
  forWhom: string;
  included: readonly string[];
  duration: string;
  priceFrom: string;
};

export const services: readonly Service[] = [
  {
    slug: "design",
    name: "Architecture and permits",
    summary:
      "We design your house, shop or school around the plot, the sun and the wind, then prepare the building permit file for the town hall.",
    forWhom: "Families and organisations with a plot and a budget, before any work starts.",
    included: [
      "Site survey and soil test of the laterite on your plot",
      "Sketch design, then detailed plans, sections and elevations",
      "Structural notes for earth-block walls and foundations",
      "Building permit file, submitted and followed up at the town hall",
    ],
    duration: "6 to 10 weeks",
    priceFrom: "From 1 200 000 FCFA",
  },
  {
    slug: "construction",
    name: "Construction",
    summary:
      "Our own masons build what we designed, with blocks from our yard. You get one contract, one site lead and a written report every week.",
    forWhom: "Clients who want one team responsible from foundations to handover.",
    included: [
      "Foundations, earth-block walls, roof and finishes",
      "A site lead on site every working day",
      "Weekly report with photos and the money spent so far",
      "A visit after the first rainy season to check the walls",
    ],
    duration: "5 to 9 months for a house",
    priceFrom: "From 185 000 FCFA per m²",
  },
  {
    slug: "blocks",
    name: "Earth blocks",
    summary:
      "Compressed earth blocks pressed at our yard in Ouèdo from laterite dug on site, stabilised with a little cement and cured for 28 days.",
    forWhom: "Builders and self-builders who already have a mason.",
    included: [
      "Full blocks (29.5 × 14 × 9 cm), half blocks and claustra blocks",
      "A test certificate for every batch: strength and water absorption",
      "Delivery within 40 km of Ouèdo, unloaded by hand",
      "Half a day of on-site advice for your mason on the first course",
    ],
    duration: "Delivery within 10 days",
    priceFrom: "From 450 FCFA per block",
  },
  {
    slug: "retrofit",
    name: "Cooling retrofit",
    summary:
      "Your concrete house is too hot? We shade it, ventilate it and insulate the roof, without rebuilding it.",
    forWhom: "Owners of existing concrete-block houses and shops.",
    included: [
      "A day of temperature readings, room by room",
      "Claustra screens on the walls that take the afternoon sun",
      "Roof insulation and openings for cross ventilation",
      "A second set of readings after the work, to compare",
    ],
    duration: "2 to 6 weeks",
    priceFrom: "From 900 000 FCFA",
  },
];

/** How a project runs, in order. Numbered on the page because it is a sequence. */
export const processSteps: readonly { title: string; text: string }[] = [
  {
    title: "Site visit",
    text: "We walk your plot with you, note the sun, the wind and the neighbours, and listen to how you want to live. Free in Cotonou and Abomey-Calavi.",
  },
  {
    title: "Soil test",
    text: "We dig a sample of the laterite and test it at the yard. Most plots in the south are suitable; when one is not, we tell you before you pay for a design.",
  },
  {
    title: "Design and permit",
    text: "Two rounds of sketches, then the detailed plans and the permit file. You sign off each stage before the next one starts.",
  },
  {
    title: "Build",
    text: "Blocks are pressed while the foundations cure. A weekly report shows progress and spending against the budget you approved.",
  },
  {
    title: "Handover and first rains",
    text: "We hand over the keys with the drawings and a maintenance guide, then come back after the first rainy season to check every wall.",
  },
];

export const faqs: readonly { question: string; answer: string }[] = [
  {
    question: "Do earth walls survive the rainy season?",
    answer:
      "Yes, when they are protected. Our blocks contain a small share of cement, the walls stand on a concrete plinth 40 cm above the ground, and roofs overhang by at least 80 cm. Those three rules keep water away from the earth.",
  },
  {
    question: "Can you build more than one storey?",
    answer:
      "Up to two storeys with load-bearing earth walls. Above that we combine a concrete frame with earth-block infill, which still keeps most of the cooling benefit.",
  },
  {
    question: "Do you work outside Cotonou?",
    answer:
      "We work across the Atlantique and Littoral departments. Further away, we supply blocks and train a local mason instead of running the site ourselves.",
  },
  {
    question: "How are payments organised?",
    answer:
      "Design is paid in three stages. Construction is paid in instalments tied to finished stages (foundations, walls, roof, finishes), never in advance of the work.",
  },
];
