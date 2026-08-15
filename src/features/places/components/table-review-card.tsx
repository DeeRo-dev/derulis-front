import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DinerReview, TableReview } from "../types";

/** Comentarios escritos: los de cada plato más el general de la visita. */
function countComments(diners: DinerReview[]): number {
  return diners.reduce(
    (total, diner) =>
      total +
      (diner.comment ? 1 : 0) +
      diner.meals.filter((meal) => meal.comment).length,
    0,
  );
}

function DinerBlock({
  diner,
  isFavorite,
}: {
  diner: DinerReview;
  isFavorite: boolean;
}) {
  const ratedMeals = diner.meals.filter((meal) => meal.derulis !== null);

  return (
    <li className="flex gap-3">
      <Avatar name={diner.name} size="md" className="mt-1" />

      <div className="min-w-0 flex-1 rounded-2xl bg-lilac-50 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {diner.name}
            </p>
            {diner.derulis !== null ? (
              <DerulisRating value={diner.derulis} size="sm" className="mt-1" />
            ) : (
              <p className="mt-1 text-xs text-muted">Sin puntuar</p>
            )}
          </div>

          {isFavorite ? (
            <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
              Favorito
            </span>
          ) : null}
        </div>

        {ratedMeals.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {ratedMeals.map((meal) => (
              <li key={meal.mealId}>
                <p className="flex items-center gap-1.5 text-sm font-medium text-lilac-700">
                  <PiForkKnifeFill
                    className="h-3.5 w-3.5 shrink-0 text-derulis"
                    aria-hidden="true"
                  />
                  <span className="truncate">{meal.name}</span>
                  <span className="shrink-0 text-xs text-muted">
                    · {meal.derulis}
                  </span>
                </p>
                {meal.comment ? (
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {meal.comment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {diner.comment ? (
          <p className="mt-3 border-t border-lilac-200 pt-3 text-sm leading-6 text-muted">
            {diner.comment}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function TableReviewCard({ review }: { review: TableReview }) {
  const [open, setOpen] = useState(false);
  const comments = countComments(review.diners);

  // El voto más alto de la mesa. Si empatan, no se destaca a nadie.
  const scores = review.diners
    .map((diner) => diner.derulis)
    .filter((value): value is number => value !== null);
  const top = scores.length > 0 ? Math.max(...scores) : null;
  const isUnique =
    top !== null && scores.filter((score) => score === top).length === 1;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold tracking-tight text-foreground">
            {review.tableName}
          </h3>
          <p className="mt-0.5 text-sm text-muted">
            {formatDate(review.date)}
            {review.totalSpend !== null
              ? ` · ${formatMoney(review.totalSpend)}`
              : ""}
          </p>
        </div>

        {review.derulis !== null ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-lilac-100 px-2.5 py-1 text-sm font-bold text-primary">
            <PiForkKnifeFill
              className="h-3.5 w-3.5 text-derulis"
              aria-hidden="true"
            />
            {review.derulis.toFixed(1)}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <AvatarStack
          people={review.diners.map((diner) => ({
            id: diner.userId,
            name: diner.name,
          }))}
        />

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {open
            ? "Ocultar"
            : comments === 0
              ? "Ver detalle"
              : `Ver ${comments} ${comments === 1 ? "comentario" : "comentarios"}`}
          <FiChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </div>

      {open ? (
        <ul className="mt-4 space-y-4 border-t border-lilac-100 pt-4">
          {review.diners.map((diner) => (
            <DinerBlock
              key={diner.userId}
              diner={diner}
              isFavorite={isUnique && diner.derulis === top}
            />
          ))}
        </ul>
      ) : null}
    </article>
  );
}
