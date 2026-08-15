import { useQuery } from "@tanstack/react-query";
import { isNotFound } from "@/lib/apiClient";
import { getPlace, getPlaceReviews, searchPlaces } from "../api/places.api";
import type { SearchPlacesParams } from "../api/places.api";

export const placesKeys = {
  all: ["places"] as const,
  list: (params: SearchPlacesParams) =>
    [...placesKeys.all, "list", params] as const,
  detail: (id: number) => [...placesKeys.all, "detail", id] as const,
  reviews: (id: number) => [...placesKeys.all, "reviews", id] as const,
};

export function usePlaces(params: SearchPlacesParams) {
  return useQuery({
    queryKey: placesKeys.list(params),
    queryFn: () => searchPlaces(params),
    // Al pasar de página, mantiene la anterior visible en vez de parpadear.
    placeholderData: (previous) => previous,
  });
}

export function usePlace(id: number) {
  return useQuery({
    queryKey: placesKeys.detail(id),
    queryFn: () => getPlace(id),
    enabled: Number.isFinite(id),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  });
}

export function usePlaceReviews(id: number) {
  return useQuery({
    queryKey: placesKeys.reviews(id),
    queryFn: () => getPlaceReviews(id),
    enabled: Number.isFinite(id),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  });
}
