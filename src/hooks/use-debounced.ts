import { useEffect, useState } from "react";

/**
 * El valor, pero recién cuando dejó de cambiar por `delay` ms.
 *
 * Se usa para buscar mientras se escribe: sin esto, cada tecla dispara una
 * consulta y la respuesta de la anterior llega desordenada.
 */
export function useDebounced<T>(value: T, delay = 350): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}
