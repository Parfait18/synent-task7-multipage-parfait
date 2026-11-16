/** Copy for the About page. The people and dates are fictional. */

export const milestones: readonly { year: number; text: string }[] = [
  { year: 2016, text: "Rachida Adjovi and Codjo Hounkpè buy a manual block press and build a first house in Calavi." },
  { year: 2018, text: "A hydraulic press and a block yard in Ouèdo. Output goes from 300 to 2\u00a0000 blocks a day." },
  { year: 2020, text: "Twelve masons finish our first training course in earth-block building." },
  { year: 2022, text: "First two-storey building: the Sènan shop and flat in Akpakpa." },
  { year: 2024, text: "Three classrooms for the primary school of Sèdjè-Dénou, built with the village." },
  { year: 2026, text: "Our thirty-first building is handed over in Fidjrossè." },
];

export const team: readonly { name: string; initials: string; role: string; bio: string }[] = [
  {
    name: "Rachida Adjovi",
    initials: "RA",
    role: "Architect, co-founder",
    bio: "Trained in Lomé, then spent four years on earth buildings in Ouagadougou. Draws every project's first sketch by hand.",
  },
  {
    name: "Codjo Hounkpè",
    initials: "CH",
    role: "Master mason, co-founder",
    bio: "Thirty years on building sites in Cotonou. Runs the block yard and decides when a batch is good enough to leave it.",
  },
  {
    name: "Estelle Dossou",
    initials: "ED",
    role: "Structural engineer",
    bio: "Checks every wall and foundation, and writes the test certificates that go with each batch of blocks.",
  },
  {
    name: "Ismaël Bio Sika",
    initials: "IB",
    role: "Site lead",
    bio: "On site every working day. Writes the weekly report clients receive on Friday evening.",
  },
];

export const commitments: readonly { title: string; text: string }[] = [
  {
    title: "No design without a soil test",
    text: "The laterite on your plot decides the mix of the blocks. We test it before you pay for drawings.",
  },
  {
    title: "No paint that traps water",
    text: "Earth walls need to breathe. We finish them with lime wash or leave the blocks bare, never with plastic paint.",
  },
  {
    title: "No more than six sites at once",
    text: "Each site has a lead who is there every day. When we are full, we give you a start date rather than a promise.",
  },
];
