import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPlace } from "@/features/places/api/places.api";
import { placesKeys } from "@/features/places/hooks/use-places";
import { createOuting } from "../api/outings.api";
import { tablesKeys } from "./use-tables";

/** Un lugar nuevo. Las coordenadas no son opcionales: sin punto no se mapea. */
export type NewPlaceInput = {
  name: string;
  address: string;
  city: string;
  province: string;
  instagram?: string;
  latitude: number;
  longitude: number;
};

export type NewOutingInput = {
  /** El lugar ya registrado que se eligió, o los datos de uno nuevo. */
  place: { existingId: number } | NewPlaceInput;
  dateTime: string;
  guestIds: number[];
  attendance: "confirmed" | "invited";
};

/**
 * Crea la salida y, si hace falta, el lugar.
 *
 * Son dos llamadas porque el backend no tiene un endpoint combinado. Si la
 * segunda falla queda un lugar sin salida, lo cual es inofensivo: los
 * lugares son públicos y reutilizables, no basura huérfana.
 *
 * Cuando el usuario elige un lugar de las sugerencias no se crea nada: se
 * reusa su id. Y si igual manda uno nuevo que ya existía, el backend
 * devuelve el existente en vez de duplicarlo.
 */
export function useCreateOuting(tableId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: NewOutingInput) => {
      const placeId =
        "existingId" in input.place
          ? input.place.existingId
          : (await createPlace(input.place)).id;

      return createOuting(tableId, {
        placeId,
        dateTime: input.dateTime,
        guestIds: input.guestIds,
        attendance: input.attendance,
        booked: input.attendance === "invited",
      });
    },
    onSuccess: (outing) => {
      void queryClient.invalidateQueries({ queryKey: tablesKeys.all });
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });

      // Si ya están comiendo, lo siguiente es cargar los platos.
      navigate(`/outings/${outing.id}/review`, { replace: true });
    },
  });
}
