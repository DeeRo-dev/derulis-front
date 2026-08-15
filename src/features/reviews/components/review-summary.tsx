import { DerulisRating } from "@/components/ui/derulis-rating";
import type { Meal } from "../types";
import { personalAverage } from "../lib/scoring";

/**
 * Resumen en vivo: el comensal ve cómo queda su voto antes de publicarlo,
 * sin tener que adivinar cómo se combinan los criterios.
 */
export function ReviewSummary({
  meals,
  place,
  service,
  value,
}: {
  meals: Meal[];
  place: number | null;
  service: number | null;
  value: number | null;
}) {
  const rated = meals.filter((meal) => meal.myDerulis !== null);
  const average = personalAverage(meals, place, service, value);

  const extras = [
    { label: "El lugar", score: place },
    { label: "Atención al cliente", score: service },
    { label: "Relación precio-calidad", score: value },
  ].filter((item) => item.score !== null);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Resumen de tu reseña
      </h2>

      {rated.length === 0 && extras.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Todavía no puntuaste nada. Empezá por las comidas.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-lilac-100">
          {rated.map((meal) => (
            <li
              key={meal.id}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="min-w-0 truncate text-sm text-muted">
                {meal.name}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <DerulisRating value={meal.myDerulis ?? 0} size="sm" />
                <span className="text-sm font-bold tabular-nums text-primary">
                  {meal.myDerulis?.toFixed(1)}
                </span>
              </span>
            </li>
          ))}

          {extras.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="min-w-0 truncate text-sm text-muted">
                {item.label}
              </span>
              <span className="text-sm font-bold tabular-nums text-primary">
                {item.score?.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-lilac-200 pt-4">
        <div>
          <p className="text-xl font-bold tracking-tight text-foreground">
            Promedio personal
          </p>
          <p className="text-xs text-muted">
            Es tu voto dentro del promedio de la mesa
          </p>
        </div>
        <p className="shrink-0 text-3xl font-bold tabular-nums text-primary">
          {average === null ? "—" : average.toFixed(1)}
        </p>
      </div>
    </section>
  );
}
