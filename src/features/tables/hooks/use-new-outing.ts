import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPlace } from "@/features/places/api/places.api";
import { placesKeys } from "@/features/places/hooks/use-places";
import { createOuting } from "../api/outings.api";
import { tablesKeys } from "./use-tables";

export type NewOutingInput = {
  name: string;
  address: string;
  city: string;
  province: string;
  instagram?: string;
  latitude?: number;
  longitude?: number;
  dateTime: string;
  guestIds: number[];
  attendance: "confirmed" | "invited";
};

/**
 * Crea el lugar y la salida en un solo gesto del usuario.
 *
 * Son dos llamadas porque el backend no tiene un endpoint combinado. Si la
 * segunda falla queda un lugar sin salida, lo cual es inofensivo: los
 * lugares son públicos y reutilizables, no basura huérfana.
 */
export function useCreateOuting(tableId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: NewOutingInput) => {
      const place = await createPlace({
        name: input.name,
        address: input.address,
        city: input.city,
        province: input.province,
        instagram: input.instagram,
        latitude: input.latitude,
        longitude: input.longitude,
      });

      return createOuting(tableId, {
        placeId: place.id,
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
