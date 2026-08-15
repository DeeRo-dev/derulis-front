import { apiClient } from "@/lib/apiClient";

export type UserStats = {
  placesVisited: number;
  reviewsCount: number;
  mealsRated: number;
  tablesCount: number;
};

export async function getMyStats(): Promise<UserStats> {
  const { data } = await apiClient.get<UserStats>("/users/me/stats");
  return data;
}
