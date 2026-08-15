import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isNotFound } from "@/lib/apiClient";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { placesKeys } from "@/features/places/hooks/use-places";
import { tablesKeys } from "@/features/tables/hooks/use-tables";
import * as api from "../api/reviews.api";

export const outingsKeys = {
  all: ["outings"] as const,
  detail: (id: number) => [...outingsKeys.all, "detail", id] as const,
  meals: (id: number) => [...outingsKeys.all, "meals", id] as const,
};

export function useOuting(id: number) {
  return useQuery({
    queryKey: outingsKeys.detail(id),
    queryFn: () => api.getOuting(id),
    enabled: Number.isFinite(id),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 1,
  });
}

export function useMeals(outingId: number) {
  const user = useCurrentUser();

  return useQuery({
    queryKey: [...outingsKeys.meals(outingId), user?.id],
    queryFn: () => api.getMeals(outingId, user?.id ?? -1),
    enabled: Number.isFinite(outingId) && !!user,
  });
}

/** Invalida lo que cambia cuando se puntúa: platos, mesa y lugar. */
function useRefreshAfterRating(outingId: number, placeId?: number) {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({
      queryKey: outingsKeys.meals(outingId),
    });
    void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
    if (placeId) {
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
    }
  };
}

/** Sumarse o bajarse de la salida: es opt-in, no te anota nadie por vos. */
export function useOutingAttendance(outingId: number) {
  const queryClient = useQueryClient();

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: outingsKeys.all });
    void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
  };

  const join = useMutation({
    mutationFn: () => api.joinOuting(outingId),
    onSuccess: refresh,
  });

  const leave = useMutation({
    mutationFn: () => api.leaveOuting(outingId),
    onSuccess: refresh,
  });

  return { join, leave };
}

export function useCreateMeal(outingId: number) {
  const refresh = useRefreshAfterRating(outingId);

  return useMutation({
    mutationFn: (input: { name: string; price?: number }) =>
      api.createMeal(outingId, input),
    onSuccess: refresh,
  });
}

export function useRateMeal(outingId: number, placeId?: number) {
  const refresh = useRefreshAfterRating(outingId, placeId);

  return useMutation({
    mutationFn: ({
      mealId,
      ...input
    }: {
      mealId: number;
      derulis: number;
      comment?: string;
    }) => api.rateMeal(mealId, input),
    onSuccess: refresh,
  });
}

export function useRateOuting(outingId: number, placeId?: number) {
  const refresh = useRefreshAfterRating(outingId, placeId);

  return useMutation({
    mutationFn: (input: {
      placeDerulis: number;
      serviceDerulis: number;
      valueDerulis?: number;
      comment?: string;
    }) => api.rateOuting(outingId, input),
    onSuccess: refresh,
  });
}

export function useCloseOuting(outingId: number, placeId?: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (totalSpend: number | null) =>
      api.closeOuting(outingId, totalSpend),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: outingsKeys.all });
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
      if (placeId) navigate(`/places/${placeId}`);
    },
  });
}
