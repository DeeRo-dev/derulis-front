import { apiClient } from "@/lib/apiClient";
import type { OutingDto } from "./dto";

export type CreateOutingInput = {
  placeId: number;
  /** ISO 8601. */
  dateTime: string;
  booked?: boolean;
  guestIds?: number[];
  /** 'confirmed' = están en el lugar ahora · 'invited' = hay que aceptar. */
  attendance?: "confirmed" | "invited";
};

/**
 * "No fuimos": la salida se cancela y deja de contar como visita. Sin esto,
 * cualquier salida que la mesa no haya hecho terminaría dándose por
 * ocurrida al día siguiente.
 */
export async function cancelOuting(outingId: number): Promise<OutingDto> {
  const { data } = await apiClient.patch<OutingDto>(`/outings/${outingId}`, {
    status: "cancelled",
  });
  return data;
}

export async function createOuting(
  tableId: number,
  input: CreateOutingInput,
): Promise<OutingDto> {
  const { data } = await apiClient.post<OutingDto>(
    `/tables/${tableId}/outings`,
    input,
  );
  return data;
}
