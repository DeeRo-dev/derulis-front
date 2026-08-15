import type { PlaceDto } from "@/features/places/api/dto";

export type MealRatingDto = {
  id: number;
  mealId: number;
  userId: number;
  derulis: number;
  comment: string | null;
};

export type MealDto = {
  id: number;
  outingId: number;
  name: string;
  price: number | null;
  createdById: number;
  ratings?: MealRatingDto[];
};

export type OutingGuestDto = {
  id: number;
  outingId: number;
  userId: number;
  user?: { id: number; name: string; avatar: string | null };
};

export type OutingDetailDto = {
  id: number;
  tableId: number;
  placeId: number;
  place: PlaceDto;
  dateTime: string;
  booked: boolean;
  totalSpend: number | null;
  status: "planned" | "done" | "cancelled";
  guests: OutingGuestDto[];
  table?: { id: number; name: string };
};

export type OutingRatingDto = {
  id: number;
  outingId: number;
  userId: number;
  placeDerulis: number;
  serviceDerulis: number;
  comment: string | null;
};
