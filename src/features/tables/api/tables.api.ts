import { apiClient } from "@/lib/apiClient";
import type { CreateTableInput, PastVisit, Table, UpcomingOuting } from "../types";
import type { OutingDto, TableDto } from "./dto";
import { toPlace } from "@/features/places/api/dto";

/* La API devuelve la mesa cruda; acá se traduce al tipo de dominio que
   consumen los componentes. Si el backend cambia de forma, se toca solo
   este archivo. */

function toUpcomingOuting(dto: OutingDto): UpcomingOuting {
  return {
    id: dto.id,
    place: toPlace(dto.place),
    dateTime: dto.dateTime,
    booked: dto.booked,
    estimatedSpend: dto.totalSpend,
  };
}

function toPastVisit(dto: OutingDto): PastVisit {
  return {
    id: dto.id,
    place: toPlace(dto.place),
    date: dto.dateTime,
    // El backend todavía no agrega el promedio en el detalle de mesa.
    derulis: null,
    outingId: dto.id,
  };
}

/** El estado no viene del backend: se deriva de la próxima salida. */
function deriveStatus(outing: OutingDto | null | undefined): {
  status: Table["status"];
  statusDetail: string;
} {
  if (!outing) {
    return { status: "deciding", statusDetail: "Decidiendo el lugar" };
  }

  if (outing.booked) {
    const time = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(outing.dateTime));
    return { status: "booked", statusDetail: `Mesa reservada ${time}` };
  }

  return { status: "deciding", statusDetail: `Propuesto: ${outing.place.name}` };
}

export function toTable(dto: TableDto): Table {
  const { status, statusDetail } = deriveStatus(dto.upcomingOuting);

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    isPrivate: dto.isPrivate,
    inviteCode: dto.inviteCode,
    status,
    statusDetail,
    // `user` puede no venir si el endpoint no cargó la relación: preferimos
    // degradar el nombre antes que romper la pantalla entera.
    members: dto.members.map((member) => ({
      id: member.userId,
      name: member.user?.name ?? "Comensal",
      avatarUrl: member.user?.avatar ?? null,
    })),
    upcomingOuting: dto.upcomingOuting
      ? toUpcomingOuting(dto.upcomingOuting)
      : null,
    pastVisits: (dto.pastVisits ?? []).map(toPastVisit),
  };
}

export async function getActiveTables(): Promise<Table[]> {
  const { data } = await apiClient.get<TableDto[]>("/tables");
  return data.map(toTable);
}

export async function getTable(id: number): Promise<Table> {
  const { data } = await apiClient.get<TableDto>(`/tables/${id}`);
  return toTable(data);
}

export async function createTable(input: CreateTableInput): Promise<Table> {
  const { data } = await apiClient.post<TableDto>("/tables", input);
  return toTable(data);
}

export async function joinTableByCode(code: string): Promise<Table> {
  const { data } = await apiClient.post<TableDto>("/tables/join", { code });
  return toTable(data);
}
