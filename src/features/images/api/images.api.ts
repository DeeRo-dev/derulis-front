import { apiClient } from "@/lib/apiClient";

export type UploadedImage = {
  id: number;
  url: string;
  storagePath: string;
  createdAt: string;
  /** Falso solo cuando exista la moderación: hoy el backend las aprueba al subirlas. */
  approved: boolean;
  /** Quién la subió. El backend lo guarda desde siempre; acá está para poder auditarlo. */
  uploadedBy: { id: number; name: string };
};

/** Igual que el backend. Duplicado a propósito: ver `validateImage`. */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Para el atributo `accept` del input. */
export const IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

/**
 * Las mismas reglas que aplica el servidor, verificadas antes de subir.
 *
 * No reemplaza la validación del backend —que es la que manda— pero evita
 * mandar 5 MB por una red de celular para que la rechacen.
 */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no admitido. Subí un JPG, PNG o WEBP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "La imagen no puede superar los 5 MB.";
  }
  if (file.size === 0) {
    return "El archivo está vacío.";
  }
  return null;
}

/**
 * POST multipart al endpoint.
 *
 * `Content-Type: undefined` es intencional: el apiClient tiene puesto
 * `application/json` por defecto, y con ese header el navegador no agrega
 * el `boundary` del multipart — el backend recibiría un cuerpo que no puede
 * parsear. Quitándolo, el navegador arma el Content-Type correcto solo.
 */
async function postImage<T>(url: string, file: File): Promise<T> {
  const form = new FormData();
  form.append("file", file);

  const { data } = await apiClient.post<T>(url, form, {
    headers: { "Content-Type": undefined },
  });

  return data;
}

/* Avatar del usuario. */

export function uploadAvatar(file: File) {
  return postImage<{ avatar: string; image: UploadedImage }>(
    "/users/me/avatar",
    file,
  );
}

export async function deleteAvatar(): Promise<void> {
  await apiClient.delete("/users/me/avatar");
}

/* Galería del lugar. */

export async function listPlaceImages(
  placeId: number,
): Promise<UploadedImage[]> {
  const { data } = await apiClient.get<UploadedImage[]>(
    `/places/${placeId}/images`,
  );
  return data;
}

export function uploadPlaceImage(placeId: number, file: File) {
  return postImage<UploadedImage>(`/places/${placeId}/images`, file);
}

export async function deletePlaceImage(
  placeId: number,
  imageId: number,
): Promise<void> {
  await apiClient.delete(`/places/${placeId}/images/${imageId}`);
}

/* Foto de la mesa. */

export function uploadTableImage(tableId: number, file: File) {
  return postImage<{ photoUrl: string; image: UploadedImage }>(
    `/tables/${tableId}/image`,
    file,
  );
}

export async function deleteTableImage(tableId: number): Promise<void> {
  await apiClient.delete(`/tables/${tableId}/image`);
}

/* Fotos de una reseña: cuelgan de la puntuación del plato. */

export async function listMealImages(mealId: number): Promise<UploadedImage[]> {
  const { data } = await apiClient.get<UploadedImage[]>(
    `/meals/${mealId}/rating/images`,
  );
  return data;
}

export function uploadMealImage(mealId: number, file: File) {
  return postImage<UploadedImage>(`/meals/${mealId}/rating/images`, file);
}

export async function deleteMealImage(
  mealId: number,
  imageId: number,
): Promise<void> {
  await apiClient.delete(`/meals/${mealId}/rating/images/${imageId}`);
}
