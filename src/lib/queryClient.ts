import { QueryClient } from "@tanstack/react-query";
import type { DefaultOptions } from "@tanstack/react-query";
import { getApiStatus } from "./apiClient";

/** Un 4xx no mejora reintentando: el pedido estaba mal, no la red. */
function isClientError(error: unknown): boolean {
  const status = getApiStatus(error);
  return status !== undefined && status >= 400 && status < 500;
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

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});
