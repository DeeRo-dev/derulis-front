import { apiClient } from "@/lib/apiClient";
import { toPlace } from "./dto";
import type { PlaceDto, PlaceReviewsDto } from "./dto";
import type { Place, PlaceReviews } from "../types";

export async function getPlaces(search?: string): Promise<Place[]> {
  const { data } = await apiClient.get<PlaceDto[]>("/places", {
    params: search ? { search } : undefined,
  });
  return data.map(toPlace);
}

export async function getPlace(
  id: number,
): Promise<Place & { derulis: number | null; visitCount: number }> {
  const { data } = await apiClient.get<
    PlaceDto & { derulis: number | null; visitCount: number }
  >(`/places/${id}`);

  return { ...toPlace(data), derulis: data.derulis, visitCount: data.visitCount };
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
