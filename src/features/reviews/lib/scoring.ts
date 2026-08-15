import type { Meal } from "../types";

/**
 * Espeja la fórmula del backend (scoring.service.ts): promedio plano de
 * cada comida puntuada más el lugar, la atención y el valor.
 * Si allá cambia el criterio, hay que cambiarlo acá también.
 */
export function personalAverage(
  meals: Meal[],
  place: number | null,
  service: number | null,
  value: number | null,
): number | null {
  const scores = [
    ...meals
      .map((meal) => meal.myDerulis)
      .filter((score): score is number => score !== null),
    place,
    service,
    value,
  ].filter((score): score is number => score !== null);

  if (scores.length === 0) return null;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / scores.length) * 100) / 100;
}
