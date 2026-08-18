import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isNotFound } from "@/lib/apiClient";
import {
  createTable,
  getActiveTables,
  getTable,
  joinTableByCode,
} from "../api/tables.api";
import { cancelOuting } from "../api/outings.api";

export const tablesKeys = {
  all: ["tables"] as const,
  active: () => [...tablesKeys.all, "active"] as const,
  detail: (id: number) => [...tablesKeys.all, "detail", id] as const,
};

export function useActiveTables() {
  return useQuery({
    queryKey: tablesKeys.active(),
    queryFn: getActiveTables,
  });
}

export function useTable(id: number) {
  return useQuery({
    queryKey: tablesKeys.detail(id),
    queryFn: () => getTable(id),
    enabled: Number.isFinite(id),
    // Reintentar un 404 no lo va a convertir en 200.
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  });
}

export function useJoinTable() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: joinTableByCode,
    meta: { silent: true },
    onSuccess: (table) => {
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      navigate(`/tables/${table.id}`, { replace: true });
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createTable,
    meta: { silent: true },
    onSuccess: (table) => {
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      // Recién creada, el siguiente paso es invitar comensales.
      navigate(`/tables/${table.id}/invite`, { replace: true });
    },
  });
}

/**
 * "No fuimos". La salida pasa a cancelada y deja de contar como visita.
 *
 * Existe porque ahora una salida se da por ocurrida sola al día siguiente:
 * sin una forma de decir que no fueron, un plan que se cayó quedaría
 * registrado como una visita al lugar.
 */
export function useCancelOuting(tableId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (outingId: number) => cancelOuting(outingId),
    meta: {
      success: "Marcamos que no fueron",
      errorMessage: "No pudimos cancelar la salida",
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tablesKeys.detail(tableId) });
      void queryClient.invalidateQueries({ queryKey: tablesKeys.active() });
    },
  });
}
