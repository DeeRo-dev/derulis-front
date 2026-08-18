import { apiClient } from "@/lib/apiClient";
import { toPlace } from "@/features/places/api/dto";
import type { PlaceDto } from "@/features/places/api/dto";
import type { PlaceWithScore } from "@/features/places/types";

type FavoritePlaceDto = PlaceDto & {
  derulis: number | null;
  visitCount: number;
  comment?: string | null;
};

/** Los lugares guardados, con la misma forma que el listado de /places. */
export async function getFavorites(): Promise<PlaceWithScore[]> {
  const { data } = await apiClient.get<FavoritePlaceDto[]>("/favorites");

  return data.map((item) => ({
    ...toPlace(item),
    derulis: item.derulis,
    visitCount: item.visitCount,
    comment: item.comment?.trim() || null,
  }));
}

/** Solo los ids: es lo que necesitan los corazones del listado. */
export async function getFavoriteIds(): Promise<number[]> {
  const { data } = await apiClient.get<number[]>("/favorites/ids");
  return data;
}

export async function addFavorite(placeId: number): Promise<void> {
  await apiClient.put(`/places/${placeId}/favorite`);
}

export async function removeFavorite(placeId: number): Promise<void> {
  await apiClient.delete(`/places/${placeId}/favorite`);
}
