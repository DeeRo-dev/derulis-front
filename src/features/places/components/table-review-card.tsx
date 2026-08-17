import { motion } from "framer-motion";
import { PiForkKnifeFill } from "react-icons/pi";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { formatDate, formatMoney } from "@/lib/format";
import { itemVariants } from "@/lib/motion";
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

/**
 * Lo que puntuó y escribió una persona en esta visita.
 *
 * La base guarda un comentario por plato (`meal_ratings.comment`) y uno
 * general de la salida (`outing_ratings.comment`). Se muestran los dos, en
 * ese orden: primero qué comió y qué le pareció, después la visita entera.
 */
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
      <Avatar name={diner.name} size="md" className="mt-1 shrink-0" />

      <div className="min-w-0 flex-1 rounded-2xl bg-cream-100 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate font-semibold text-foreground">
            {diner.name}
          </p>

          {isFavorite ? (
            <span className="shrink-0 rounded-full bg-derulis/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
              Favorito
            </span>
          ) : null}
        </div>

        {diner.derulis !== null ? (
          <DerulisRating value={diner.derulis} size="sm" className="mt-1.5" />
        ) : (
          <p className="mt-1.5 text-xs text-muted">Sin puntuar</p>
        )}

        {ratedMeals.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {ratedMeals.map((meal) => (
              <li key={meal.mealId}>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-lilac-700">
                    <PiForkKnifeFill
                      className="h-3.5 w-3.5 shrink-0 text-derulis"
                      aria-hidden="true"
                    />
                    <span className="truncate">{meal.name}</span>
                  </span>
                  <DerulisRating value={meal.derulis!} size="sm" />
                  {meal.price !== null ? (
                    <span className="text-xs text-muted">
                      {formatMoney(meal.price)}
                    </span>
                  ) : null}
                </p>

                {meal.comment ? (
                  <p className="mt-1 text-sm leading-6 text-foreground/80">
                    {meal.comment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {diner.comment ? (
          <p className="mt-3 border-t border-cream-200 pt-3 text-sm leading-6 text-foreground/80">
            {diner.comment}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function TableReviewCard({ review }: { review: TableReview }) {
  const comments = countComments(review.diners);

  // El voto más alto de la mesa. Si empatan, no se destaca a nadie.
  const scores = review.diners
    .map((diner) => diner.derulis)
    .filter((value): value is number => value !== null);
  const top = scores.length > 0 ? Math.max(...scores) : null;
  const isUnique =
    top !== null && scores.filter((score) => score === top).length === 1;

  return (
    <motion.article
      variants={itemVariants}
      className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold tracking-tight text-foreground">
            {review.tableName}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted">
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

      {/* type="single" + collapsible: una mesa por vez y se puede cerrar. */}
      <Accordion type="single" collapsible>
        <AccordionItem value="diners" className="border-b-0">
          <div className="flex items-center justify-between gap-3">
            <AvatarStack
              people={review.diners.map((diner) => ({
                id: diner.userId,
                name: diner.name,
              }))}
            />

            <AccordionTrigger className="flex-none px-2 font-semibold text-primary hover:bg-lilac-50">
              {comments === 0
                ? "Ver detalle"
                : `Ver ${comments} ${comments === 1 ? "comentario" : "comentarios"}`}
            </AccordionTrigger>
          </div>

          <AccordionContent className="pb-0">
            <ul className="space-y-4 border-t border-lilac-100 pt-4">
              {review.diners.map((diner) => (
                <DinerBlock
                  key={diner.userId}
                  diner={diner}
                  isFavorite={isUnique && diner.derulis === top}
                />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.article>
  );
}
