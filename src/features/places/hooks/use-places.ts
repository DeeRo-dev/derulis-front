import { useQuery } from "@tanstack/react-query";
import { isNotFound } from "@/lib/apiClient";
import { getPlace, getPlaceReviews, getPlaces } from "../api/places.api";

export const placesKeys = {
  all: ["places"] as const,
  list: (search?: string) => [...placesKeys.all, "list", search ?? ""] as const,
  detail: (id: number) => [...placesKeys.all, "detail", id] as const,
  reviews: (id: number) => [...placesKeys.all, "reviews", id] as const,
};

export function usePlaces(search?: string) {
  return useQuery({
    queryKey: placesKeys.list(search),
    queryFn: () => getPlaces(search),
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
