import type { Place } from "@/features/places/types";

/** "Mesa" en la interfaz. En código va en inglés como el resto del dominio. */
export type TableStatus = "deciding" | "booked" | "closed";

export type Diner = {
  id: number;
  name: string;
  avatarUrl?: string | null;
};

/** Salida planificada de la mesa. Puede estar reservada o no. */
export type UpcomingOuting = {
  id: number;
  place: Place;
  /** ISO 8601. */
  dateTime: string;
  booked: boolean;
  /** Gasto estimado por persona, en centavos. */
  estimatedSpend: number | null;
};

/** Visita ya ocurrida. */
export type PastVisit = {
  id: number;
  place: Place;
  /** ISO 8601. */
  date: string;
  /** null mientras nadie de la mesa la haya puntuado. */
  derulis: number | null;
  /** Id de la salida: es la reseña de esa visita. */
  outingId: number;
};

/**
 * Una mesa es un grupo que persiste en el tiempo, no una sola salida:
 * tiene miembros fijos, una próxima salida y un historial de visitas.
 */
export type Table = {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  photoUrl: string | null;
  inviteCode: string | null;
  status: TableStatus;
  statusDetail: string;
  members: Diner[];
  upcomingOuting: UpcomingOuting | null;
  /**
   * La salida que ya ocurrió y nadie cerró. Es lo primero que la mesa tiene
   * que ver: le falta cargar lo que comieron.
   */
  pendingOuting: UpcomingOuting | null;
  pastVisits: PastVisit[];
  /** Último lugar visitado. Lo usa el listado: "Última: <lugar>". */
  lastVisit: PastVisit | null;
};

export type CreateTableInput = {
  name: string;
  description: string;
};
