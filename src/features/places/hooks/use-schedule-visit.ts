import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createOuting } from "@/features/tables/api/outings.api";
import { tablesKeys } from "@/features/tables/hooks/use-tables";
import { placesKeys } from "./use-places";

/**
 * Agenda una visita a un lugar que ya existe.
 *
 * A diferencia de `useCreateOuting`, que crea el lugar y la salida juntos
 * desde el formulario de una mesa, acá el lugar ya está: se manda su id y
 * no se duplica la ficha.
 *
 * `attendance: "invited"` — es una salida a futuro, los comensales tienen
 * que aceptar. `booked: true` por lo mismo: la mesa quedó agendada.
 */
export function useScheduleVisit(placeId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      tableId,
      dateTime,
    }: {
      tableId: number;
      dateTime: string;
    }) =>
      createOuting(tableId, {
        placeId,
        dateTime,
        attendance: "invited",
        booked: true,
      }),
    onSuccess: (_outing, { tableId }) => {
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });

      // La salida vive en la mesa: ahí se ve quién confirmó.
      navigate(`/tables/${tableId}`);
    },
  });
}
