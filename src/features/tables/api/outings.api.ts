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
