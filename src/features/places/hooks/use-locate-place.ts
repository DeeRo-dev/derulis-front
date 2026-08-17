import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locatePlace } from "../api/places.api";
import { placesKeys } from "./use-places";

/**
 * Completa las coordenadas de un lugar cargado sin punto en el mapa.
 *
 * Corre solo cuando hace falta y una sola vez por montaje: el backend lo
 * resuelve una vez y lo guarda, así que a la siguiente visita el lugar ya
 * viene ubicado y esto no se dispara.
 *
 * No expone estado: si la dirección no se puede resolver, la pantalla queda
 * como estaba. No es algo que el usuario haya pedido, así que tampoco es un
 * error que valga la pena mostrarle.
 */
export function useLocatePlace(placeId: number, enabled: boolean) {
  const queryClient = useQueryClient();
  const attempted = useRef(false);

  const mutation = useMutation({
    mutationFn: () => locatePlace(placeId),
    onSuccess: (place) => {
      // Sin coordenadas nuevas no hay nada que refrescar.
      if (place.latitude === null || place.longitude === null) return;

      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
    },
  });

  const { mutate } = mutation;

  useEffect(() => {
    if (!enabled || attempted.current || !Number.isFinite(placeId)) return;
    attempted.current = true;
    mutate();
  }, [enabled, placeId, mutate]);
}
