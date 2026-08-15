/** Obelisco: centro por defecto del mapa cuando no hay nada que mostrar. */
export const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816];

export type MapPoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  /** Texto corto bajo el nombre, ej. la ciudad. */
  subtitle?: string;
  /** Se dibuja dentro del pin: la nota, o un punto si no hay. */
  badge?: string;
};
