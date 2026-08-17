import { apiClient } from "@/lib/apiClient";
import { toPlace } from "./dto";
import type { PlaceDto, PlaceReviewsDto } from "./dto";
import type { Place, PlaceReviews, PlaceWithScore, PagedPlaces } from "../types";

export type CreatePlaceInput = {
  name: string;
  address: string;
  city?: string;
  province?: string;
  country?: string;
  instagram?: string;
  /* Obligatorias: el backend rechaza un lugar sin punto en el mapa. */
  latitude: number;
  longitude: number;
};

export type SearchPlacesParams = {
  search?: string;
  city?: string;
  province?: string;
  country?: string;
  sort?: "top" | "name";
  page?: number;
  limit?: number;
};

type PagedPlacesDto = {
  items: (PlaceDto & {
    derulis: number | null;
    visitCount: number;
    comment?: string | null;
  })[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export async function createPlace(input: CreatePlaceInput): Promise<Place> {
  const { data } = await apiClient.post<PlaceDto>("/places", input);
  return toPlace(data);
}

export async function searchPlaces(
  params: SearchPlacesParams,
): Promise<PagedPlaces> {
  const { data } = await apiClient.get<PagedPlacesDto>("/places", { params });

  /* Un backend viejo devuelve un array plano en vez de {items,...}. Sin
     esta guarda explota con un TypeError críptico y la UI termina diciendo
     "sin conexión", que es justo lo que no pasó. */
  if (!data || !Array.isArray(data.items)) {
    throw new Error(
      "La API devolvió un formato inesperado en /places. ¿El backend está actualizado?",
    );
  }

  const items: PlaceWithScore[] = data.items.map((item) => ({
    ...toPlace(item),
    derulis: item.derulis,
    visitCount: item.visitCount,
    // Un backend sin el campo todavía: la tarjeta simplemente no lo muestra.
    comment: item.comment?.trim() || null,
  }));

  return {
    items,
    page: data.page,
    limit: data.limit,
    total: data.total,
    hasMore: data.hasMore,
  };
}

export async function getPlace(id: number): Promise<PlaceWithScore> {
  const { data } = await apiClient.get<
    PlaceDto & { derulis: number | null; visitCount: number }
  >(`/places/${id}`);

  return {
    ...toPlace(data),
    derulis: data.derulis,
    visitCount: data.visitCount,
    // El detalle trae las reseñas completas aparte, no hace falta la muestra.
    comment: null,
  };
}

/**
 * Pide al backend que complete las coordenadas del lugar a partir de su
 * dirección. Es idempotente: si ya tiene punto, o si ya se intentó y la
 * dirección no se pudo resolver, devuelve el lugar sin consultar de nuevo.
 */
export async function locatePlace(id: number): Promise<Place> {
  const { data } = await apiClient.post<PlaceDto>(`/places/${id}/locate`);
  return toPlace(data);
}

export async function getPlaceReviews(id: number): Promise<PlaceReviews> {
  const { data } = await apiClient.get<PlaceReviewsDto>(`/places/${id}/reviews`);

  return {
    place: toPlace(data.place),
    derulis: data.derulis,
    visitCount: data.visitCount,
    tables: data.tables,
  };
}
