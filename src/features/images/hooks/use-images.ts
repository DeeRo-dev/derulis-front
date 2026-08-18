import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placesKeys } from "@/features/places/hooks/use-places";
import { tablesKeys } from "@/features/tables/hooks/use-tables";
import { updateStoredUser } from "@/lib/auth-storage";
import {
  deleteAvatar,
  deleteMealImage,
  deletePlaceImage,
  deleteTableImage,
  listMealImages,
  listPlaceImages,
  uploadAvatar,
  uploadMealImage,
  uploadPlaceImage,
  uploadTableImage,
} from "../api/images.api";

export const imagesKeys = {
  place: (placeId: number) => ["images", "place", placeId] as const,
  meal: (mealId: number) => ["images", "meal", mealId] as const,
};

/* El usuario logueado vive en localStorage, no en react-query (ver
   `useCurrentUser`), así que el avatar se actualiza ahí. `updateStoredUser`
   avisa a quien esté suscripto: la foto cambia al toque en el perfil y en
   el menú lateral. */

export function useUploadAvatar() {
  return useMutation({
    mutationFn: uploadAvatar,
    meta: { success: "Foto de perfil actualizada", errorMessage: "No pudimos subir la foto" },
    onSuccess: ({ avatar }) => updateStoredUser({ avatar }),
  });
}

export function useDeleteAvatar() {
  return useMutation({
    mutationFn: deleteAvatar,
    meta: { success: "Foto de perfil quitada", errorMessage: "No pudimos quitar la foto" },
    onSuccess: () => updateStoredUser({ avatar: null }),
  });
}

export function usePlaceImages(placeId: number) {
  return useQuery({
    queryKey: imagesKeys.place(placeId),
    queryFn: () => listPlaceImages(placeId),
    enabled: Number.isFinite(placeId),
  });
}

export function useUploadPlaceImage(placeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadPlaceImage(placeId, file),
    meta: { success: "Foto agregada", errorMessage: "No pudimos subir la foto" },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: imagesKeys.place(placeId) });
      // La primera foto pasa a ser la principal del lugar.
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
    },
  });
}

export function useDeletePlaceImage(placeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => deletePlaceImage(placeId, imageId),
    meta: { success: "Foto borrada", errorMessage: "No pudimos borrar la foto" },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: imagesKeys.place(placeId) });
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
    },
  });
}

export function useUploadTableImage(tableId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadTableImage(tableId, file),
    meta: { success: "Foto de la mesa actualizada", errorMessage: "No pudimos subir la foto" },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all }),
  });
}

export function useDeleteTableImage(tableId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTableImage(tableId),
    meta: { success: "Foto de la mesa quitada", errorMessage: "No pudimos quitar la foto" },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all }),
  });
}

/**
 * Fotos de la reseña de un plato. Solo existen si vos lo puntuaste: el
 * endpoint responde 403 si no, así que no se consulta hasta que haya nota.
 */
export function useMealImages(mealId: number, rated: boolean) {
  return useQuery({
    queryKey: imagesKeys.meal(mealId),
    queryFn: () => listMealImages(mealId),
    enabled: Number.isFinite(mealId) && rated,
  });
}

export function useUploadMealImage(mealId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMealImage(mealId, file),
    meta: { success: "Foto agregada", errorMessage: "No pudimos subir la foto" },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: imagesKeys.meal(mealId) }),
  });
}

export function useDeleteMealImage(mealId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => deleteMealImage(mealId, imageId),
    meta: { success: "Foto borrada", errorMessage: "No pudimos borrar la foto" },
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: imagesKeys.meal(mealId) }),
  });
}
