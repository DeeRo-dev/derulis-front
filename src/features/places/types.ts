export type Place = {
  id: number;
  name: string;
  address: string;
  photoUrl: string | null;
  city: string | null;
  province: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  /** Etiquetas cortas: "Japonés", "Omakase". Vacío hasta que el backend las modele. */
  cuisines: string[];
  instagram: string | null;
};

export type MealReview = {
  mealId: number;
  name: string;
  price: number | null;
  derulis: number | null;
  comment: string | null;
};

/** Lo que puntuó un comensal en una visita. */
export type DinerReview = {
  userId: number;
  name: string;
  /** Su voto al lugar: promedio de comidas, lugar y atención. */
  derulis: number | null;
  mealsDerulis: number | null;
  placeDerulis: number | null;
  serviceDerulis: number | null;
  comment: string | null;
  meals: MealReview[];
};

/** La reseña de una mesa: una visita, con lo que opinó cada comensal. */
export type TableReview = {
  outingId: number;
  tableId: number;
  tableName: string;
  date: string;
  totalSpend: number | null;
  derulis: number | null;
  diners: DinerReview[];
};

export type PlaceReviews = {
  place: Place;
  /** Promedio global: promedio de las mesas que lo visitaron. */
  derulis: number | null;
  visitCount: number;
  tables: TableReview[];
};

export type PlaceWithScore = Place & {
  derulis: number | null;
  visitCount: number;
  /**
   * Un comentario cualquiera de los que dejó la comunidad, para mostrar de
   * muestra en el listado. Sólo lo trae el listado: en el detalle es `null`
   * porque ahí se leen todas las reseñas.
   */
  comment: string | null;
};

export type PagedPlaces = {
  items: PlaceWithScore[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
