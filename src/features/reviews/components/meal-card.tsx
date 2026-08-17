import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { DerulisPicker } from "@/components/ui/derulis-picker";
import { TextArea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import { MealPhotos } from "./meal-photos";
import type { Meal } from "../types";

const COMMENT_MAX = 1000;

export function MealCard({
  meal,
  onSave,
  isSaving,
}: {
  meal: Meal;
  onSave: (input: { derulis: number; comment?: string }) => void;
  isSaving: boolean;
}) {
  /* El estado arranca de lo que trajo el servidor. La página remonta esta
     tarjeta con `key` cuando ese valor cambia, así no hace falta sincronizar
     con un efecto (que además dispara el lint de React). */
  const [derulis, setDerulis] = useState<number | null>(meal.myDerulis);
  const [comment, setComment] = useState(meal.myComment ?? "");

  const dirty =
    derulis !== meal.myDerulis || comment !== (meal.myComment ?? "");

  return (
    <article className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
            {meal.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {meal.price !== null ? formatMoney(meal.price) : "Sin precio"}
            {meal.ratingCount > 0
              ? ` · ${meal.ratingCount} ${meal.ratingCount === 1 ? "puntuación" : "puntuaciones"}`
              : " · nadie la puntuó todavía"}
          </p>
        </div>

        {meal.myDerulis !== null && !dirty ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
            <FiCheck className="h-3 w-3" aria-hidden="true" />
            Puntuada
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <DerulisPicker
          label="Tu puntuación"
          value={derulis}
          onChange={setDerulis}
          name={`meal-${meal.id}`}
        />
      </div>

      <div className="mt-4">
        <TextArea
          label="Comentario"
          placeholder="¿Qué te pareció? Lo que le dirías a un amigo."
          maxLength={COMMENT_MAX}
          count={comment.length}
          hint="Opcional"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* `meal.myDerulis`, no el estado local: la foto necesita la
          puntuación ya guardada en el servidor, no la que estás eligiendo. */}
      <MealPhotos mealId={meal.id} rated={meal.myDerulis !== null} />

      <Button
        className="mt-4 w-full"
        disabled={derulis === null || !dirty || isSaving}
        onClick={() =>
          derulis !== null &&
          onSave({ derulis, comment: comment.trim() || undefined })
        }
      >
        {isSaving
          ? "Guardando…"
          : meal.myDerulis === null
            ? "Puntuar"
            : "Actualizar"}
      </Button>
    </article>
  );
}
