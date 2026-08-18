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

export type Profile = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
};

export async function updateProfile(name: string): Promise<Profile> {
  const { data } = await apiClient.patch<Profile>("/users/me", { name });
  return data;
}

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  await apiClient.put("/users/me/password", input);
}
