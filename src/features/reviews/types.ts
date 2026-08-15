import type { Place } from "@/features/places/types";

export type Guest = {
  id: number;
  name: string;
};

export type OutingDetail = {
  id: number;
  tableId: number;
  tableName: string;
  place: Place;
  dateTime: string;
  status: "planned" | "done" | "cancelled";
  totalSpend: number | null;
  guests: Guest[];
};

/** Un plato de la salida, con MI puntuación resuelta aparte. */
export type Meal = {
  id: number;
  name: string;
  price: number | null;
  myDerulis: number | null;
  myComment: string | null;
  /** Cuántos comensales lo puntuaron, incluido yo. */
  ratingCount: number;
};
