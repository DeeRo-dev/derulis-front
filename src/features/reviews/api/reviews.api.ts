import { apiClient } from "@/lib/apiClient";
import { toPlace } from "@/features/places/api/dto";
import type { MealDto, OutingDetailDto, OutingRatingDto } from "./dto";
import type { Meal, OutingDetail } from "../types";

/** Junta el plato con MI puntuación, que es lo único que puedo editar. */
function toMeal(dto: MealDto, currentUserId: number): Meal {
  const mine = dto.ratings?.find((rating) => rating.userId === currentUserId);

  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    myDerulis: mine?.derulis ?? null,
    myComment: mine?.comment ?? null,
    ratingCount: dto.ratings?.length ?? 0,
  };
}

export async function getOuting(id: number): Promise<OutingDetail> {
  const { data } = await apiClient.get<OutingDetailDto>(`/outings/${id}`);

  return {
    id: data.id,
    tableId: data.tableId,
    tableName: data.table?.name ?? "Mesa",
    place: toPlace(data.place),
    dateTime: data.dateTime,
    status: data.status,
    totalSpend: data.totalSpend,
    guests: data.guests.map((guest) => ({
      id: guest.userId,
      name: guest.user?.name ?? "Comensal",
    })),
  };
}

export async function getMeals(
  outingId: number,
  currentUserId: number,
): Promise<Meal[]> {
  const { data } = await apiClient.get<MealDto[]>(`/outings/${outingId}/meals`);
  return data.map((meal) => toMeal(meal, currentUserId));
}

export async function createMeal(
  outingId: number,
  input: { name: string; price?: number },
): Promise<MealDto> {
  const { data } = await apiClient.post<MealDto>(
    `/outings/${outingId}/meals`,
    input,
  );
  return data;
}

export async function rateMeal(
  mealId: number,
  input: { derulis: number; comment?: string },
) {
  const { data } = await apiClient.put(`/meals/${mealId}/rating`, input);
  return data;
}

export async function rateOuting(
  outingId: number,
  input: { placeDerulis: number; serviceDerulis: number; comment?: string },
): Promise<OutingRatingDto> {
  const { data } = await apiClient.put<OutingRatingDto>(
    `/outings/${outingId}/rating`,
    input,
  );
  return data;
}

export async function closeOuting(
  outingId: number,
  totalSpend: number | null,
) {
  const { data } = await apiClient.patch(`/outings/${outingId}`, {
    status: "done",
    ...(totalSpend !== null ? { totalSpend } : {}),
  });
  return data;
}
