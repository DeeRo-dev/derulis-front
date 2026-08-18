import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavoriteIds,
  getFavorites,
  removeFavorite,
} from "../api/favorites.api";

export const favoritesKeys = {
  all: ["favorites"] as const,
  list: () => [...favoritesKeys.all, "list"] as const,
  ids: () => [...favoritesKeys.all, "ids"] as const,
};

/** La lista completa, para la pantalla de Favoritos. */
export function useFavorites() {
  return useQuery({
    queryKey: favoritesKeys.list(),
    queryFn: getFavorites,
  });
}

/**
 * Los ids guardados. Se piden una vez y quedan en caché: cada corazón lee
 * de acá en vez de preguntar por su lugar, así una lista de veinte tarjetas
 * no dispara veinte consultas.
 */
export function useFavoriteIds() {
  return useQuery({
    queryKey: favoritesKeys.ids(),
    queryFn: getFavoriteIds,
    // Un Set: las tarjetas preguntan por pertenencia, no recorren la lista.
    select: (ids) => new Set(ids),
  });
}

/**
 * Marca o desmarca. El corazón cambia al instante y recién después se
 * confirma con el servidor: esperar el ida y vuelta para un gesto de un
 * toque se siente roto.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      placeId,
      favorite,
    }: {
      placeId: number;
      favorite: boolean;
    }) => (favorite ? addFavorite(placeId) : removeFavorite(placeId)),
    meta: { errorMessage: "No pudimos guardar el favorito" },

    onMutate: async ({ placeId, favorite }) => {
      // Sin esto, una consulta en vuelo puede pisar el cambio optimista.
      await queryClient.cancelQueries({ queryKey: favoritesKeys.ids() });

      const previous = queryClient.getQueryData<number[]>(favoritesKeys.ids());

      queryClient.setQueryData<number[]>(favoritesKeys.ids(), (current) => {
        const ids = current ?? [];
        if (favorite) return ids.includes(placeId) ? ids : [placeId, ...ids];
        return ids.filter((id) => id !== placeId);
      });

      return { previous };
    },

    onError: (_error, _variables, context) => {
      // Falló: se vuelve a como estaba, no se deja un corazón mentiroso.
      if (context?.previous) {
        queryClient.setQueryData(favoritesKeys.ids(), context.previous);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoritesKeys.all });
    },
  });
}
