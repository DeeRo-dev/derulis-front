import type { Place } from "../types";

/** Forma cruda del lugar que devuelve la API. */
export type PlaceDto = {
  id: number;
  name: string;
  address: string;
  instagram: string | null;
  photoUrl: string | null;
  /** Todavía no existe en el backend. */
  cuisines?: string[];
};

/**
 * El backend aún no modela las etiquetas de cocina. Sin este default,
 * `place.cuisines.join()` explota en la pantalla de próxima salida.
 */
export function toPlace(dto: PlaceDto): Place {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    photoUrl: dto.photoUrl,
    instagram: dto.instagram,
    cuisines: dto.cuisines ?? [],
  };
}

export type DinerReviewDto = {
  userId: number;
  name: string;
  derulis: number | null;
  mealsDerulis: number | null;
  placeDerulis: number | null;
  serviceDerulis: number | null;
  comment: string | null;
  meals: {
    mealId: number;
    name: string;
    price: number | null;
    derulis: number | null;
    comment: string | null;
  }[];
};

export type TableReviewDto = {
  outingId: number;
  tableId: number;
  tableName: string;
  date: string;
  totalSpend: number | null;
  derulis: number | null;
  diners: DinerReviewDto[];
};

export type PlaceReviewsDto = {
  place: PlaceDto;
  derulis: number | null;
  visitCount: number;
  tables: TableReviewDto[];
};
