import type { ElevationKind } from "@/components/art/elevation";

/** Featured projects shown on the home page. All are fictional. */
export type Project = {
  name: string;
  kind: ElevationKind;
  place: string;
  year: number;
  programme: string;
  floorArea: string;
  story: string;
};

export const featuredProjects: readonly Project[] = [
  {
    name: "Houénou family house",
    kind: "house",
    place: "Togba, Abomey-Calavi",
    year: 2023,
    programme: "Single-storey house, three bedrooms",
    floorArea: "142 m²",
    story:
      "A deep roof overhang keeps the noon sun off the walls. The family sleeps without air conditioning from November to March.",
  },
  {
    name: "Sènan shop and flat",
    kind: "shop",
    place: "Akpakpa, Cotonou",
    year: 2022,
    programme: "Ground-floor shop, flat above",
    floorArea: "96 m²",
    story:
      "Our first two-storey building. A claustra screen shades the flat and lets the sea breeze through without opening a window to the street.",
  },
  {
    name: "Sèdjè-Dénou primary school",
    kind: "school",
    place: "Zè, Atlantique",
    year: 2024,
    programme: "Three classrooms and a covered yard",
    floorArea: "210 m²",
    story:
      "The roof floats above the classrooms so hot air escapes at the ridge. Parents from the village pressed a third of the blocks.",
  },
];
