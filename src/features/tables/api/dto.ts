import type { PlaceDto } from "@/features/places/api/dto";

/* Forma cruda que devuelve la API. Se mapea a los tipos de dominio en
   tables.api.ts para que los componentes no dependan del backend. */

export type UserDto = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
};

export type TableMemberDto = {
  id: number;
  tableId: number;
  userId: number;
  user?: UserDto;
  status: "invited" | "accepted";
};

export type OutingDto = {
  id: number;
  tableId: number;
  placeId: number;
  place: PlaceDto;
  dateTime: string;
  booked: boolean;
  totalSpend: number | null;
  status: "planned" | "done" | "cancelled";
};

export type TableDto = {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  inviteCode: string | null;
  createdById: number;
  members: TableMemberDto[];
  upcomingOuting?: OutingDto | null;
  pastVisits?: OutingDto[];
};
