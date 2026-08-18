import { MutationCache, QueryClient } from "@tanstack/react-query";
import type { DefaultOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage, getApiStatus, isNetworkError } from "./apiClient";

/** Un 4xx no mejora reintentando: el pedido estaba mal, no la red. */
function isClientError(error: unknown): boolean {
  const status = getApiStatus(error);
  return status !== undefined && status >= 400 && status < 500;
}

/**
 * Lo que cada mutación puede declarar sobre sus avisos.
 *
 * Va en `meta` y no en callbacks porque así el aviso se decide donde se
 * define la mutación, en una línea, y el manejo vive en un solo lugar.
 */
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Texto del aviso cuando sale bien. Sin esto, el éxito es silencioso. */
      success?: string;
      /** Encabezado del aviso de error. El detalle lo pone el backend. */
      errorMessage?: string;
      /** Para las que ya muestran el error dentro del formulario. */
      silent?: boolean;
    };
  }
}

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    /* Nunca reintentar: además de ser inútil ante un 4xx, reintentar una
       mutación puede duplicar efectos (crear dos mesas, dos comidas). */
    retry: false,
  },
};

/**
 * Avisos automáticos para las acciones del usuario.
 *
 * Solo mutaciones, no consultas: una consulta se dispara sola —al entrar a
 * una pantalla, al volver a la pestaña— y avisar de cada una llenaría la
 * pantalla de carteles que nadie pidió. Las pantallas ya muestran su propio
 * estado de error cuando no pueden cargar. Una mutación, en cambio, siempre
 * es algo que la persona hizo a propósito, y ahí sí espera una respuesta.
 */
const mutationCache = new MutationCache({
  onSuccess: (_data, _variables, _context, mutation) => {
    const message = mutation.meta?.success;
    if (message) toast.success(message);
  },

  onError: (error, _variables, _context, mutation) => {
    if (mutation.meta?.silent) return;

    /* El 401 ya lo maneja el interceptor: cierra la sesión y manda al
       login. Un cartel que aparece mientras la pantalla cambia solo
       agrega ruido. */
    if (getApiStatus(error) === 401) return;

    const fallback = mutation.meta?.errorMessage ?? "No pudimos completarlo";

    toast.error(fallback, {
      description: isNetworkError(error)
        ? "Revisá tu conexión y volvé a intentar."
        : getApiErrorMessage(error, "Probá de nuevo en un momento."),
      // Los errores no se van solos: si te distrajiste, seguís queriendo verlo.
      duration: Infinity,
      closeButton: true,
    });
  },
});

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  mutationCache,
});
