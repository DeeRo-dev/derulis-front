import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { uploadPlaceImage } from "@/features/images/api/images.api";
import { imagesKeys } from "@/features/images/hooks/use-images";
import { createPlace } from "../api/places.api";
import type { CreatePlaceInput } from "../api/places.api";
import { placesKeys } from "./use-places";

export type NewPlaceForm = CreatePlaceInput & {
  /** Opcional: si viene, se sube después de crear la ficha. */
  photo?: File | null;
};

/**
 * Registra un lugar por su cuenta, sin salida de por medio.
 *
 * La foto va en una segunda llamada porque el endpoint de imágenes necesita
 * el id del lugar, que recién existe cuando la ficha está guardada. Si esa
 * segunda falla no se pierde el alta: el lugar ya quedó registrado y la foto
 * se puede sumar después desde su galería, así que se avisa y se sigue.
 */
export function useCreatePlace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    // El formulario muestra el error arriba, junto a los campos.
    meta: { silent: true },
    mutationFn: async ({ photo, ...input }: NewPlaceForm) => {
      const place = await createPlace(input);

      if (photo) {
        try {
          await uploadPlaceImage(place.id, photo);
        } catch {
          /* El caso típico: el backend devolvió un lugar que ya estaba
             cargado por otra persona, y ahí la foto solo la puede poner
             quien lo visitó. */
          toast.warning("Guardamos el lugar, pero no pudimos subir la foto", {
            description: "Podés agregarla desde su galería.",
          });
        }
      }

      return place;
    },
    onSuccess: (place) => {
      void queryClient.invalidateQueries({ queryKey: placesKeys.all });
      void queryClient.invalidateQueries({ queryKey: imagesKeys.place(place.id) });

      toast.success(`${place.name} quedó registrado`);
      navigate(`/places/${place.id}`, { replace: true });
    },
  });
}
