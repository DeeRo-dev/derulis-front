import type { Place } from "@/features/places/types";

/* MOCK — el backend todavía no expone un feed global de actividad. Cuando
   exista, se reemplaza solo este archivo (ver FRONTEND-BRIEF.md). */

export type FeedItem = {
  id: number;
  placeId: number;
  place: Place;
  derulis: number;
  spendPerPerson: number;
  comment: string;
  authorName: string;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const FEED: FeedItem[] = [
  {
    id: 1,
    placeId: 1,
    place: {
      id: 1,
      name: "Osteria Bianca",
      address: "Av. Culinaria 124, Centro",
      photoUrl: null,
      cuisines: ["Italiano", "Pastas"],
      instagram: "osteriabianca",
    },
    derulis: 4,
    spendPerPerson: 2400_00,
    comment:
      "Los sorrentinos caseros fueron una revelación. Al dente perfecto y una salsa que no tapaba el relleno.",
    authorName: "Clara Torres",
  },
  {
    id: 2,
    placeId: 2,
    place: {
      id: 2,
      name: "Nami Sushi",
      address: "Ocean Blvd 88, Costanera",
      photoUrl: null,
      cuisines: ["Japonés", "Omakase"],
      instagram: null,
    },
    derulis: 5,
    spendPerPerson: 1800_00,
    comment:
      "Omakase increíble que no te funde. El toro literalmente se deshace en la boca.",
    authorName: "Mateo Silva",
  },
];

export async function getFeed(): Promise<FeedItem[]> {
  await delay(600);
  return FEED;
}
