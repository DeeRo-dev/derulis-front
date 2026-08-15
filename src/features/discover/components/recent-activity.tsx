import { Link } from "react-router-dom";
import { FiMapPin, FiWifiOff } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { PlacePhoto } from "@/components/ui/place-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { priceLevel } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { getFeed } from "../api/feed.api";
import type { FeedItem } from "../api/feed.api";

function ReviewCard({ review }: { review: FeedItem }) {
  return (
    /* La tarjeta entera es clickeable, pero el link sigue siendo uno solo:
       `after:inset-0` lo estira sobre la tarjeta en vez de anidar
       interactivos, así el lector de pantalla anuncia un único destino. */
    <article className="relative overflow-hidden rounded-3xl bg-white shadow-lg shadow-lilac-200/50 transition focus-within:ring-2 focus-within:ring-primary hover:shadow-xl">
      <div className="relative h-44">
        <PlacePhoto src={review.place.photoUrl} alt={review.place.name} />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-lilac-700 backdrop-blur">
          {priceLevel(review.spendPerPerson)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
              <Link
                to={`/places/${review.placeId}`}
                className="after:absolute after:inset-0 focus:outline-none"
              >
                {review.place.name}
              </Link>
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <FiMapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{review.place.address}</span>
            </p>
          </div>
          <DerulisRating value={review.derulis} className="mt-1 shrink-0" />
        </div>

        <p className="mt-3 text-sm leading-6 text-muted">“{review.comment}”</p>

        <div className="mt-4 flex items-center gap-2 border-t border-lilac-100 pt-4">
          <Avatar name={review.authorName} size="sm" />
          <span className="text-xs text-muted">
            Puntuado por{" "}
            <span className="font-medium text-foreground">
              {review.authorName}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}

function ReviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-lilac-200/50">
      <Skeleton className="h-44 rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function RecentActivity() {
  const {
    data: reviews,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ["feed"], queryFn: getFeed });

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Actividad reciente
      </h2>

      <div className="mt-3 space-y-5">
        {isPending ? (
          <>
            <ReviewSkeleton />
            <ReviewSkeleton />
          </>
        ) : isError ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <FiWifiOff
              className="mx-auto h-8 w-8 text-lilac-400"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-foreground">Sin conexión</p>
            <p className="mt-1 text-sm text-muted">
              Revisá tu internet y volvé a intentar.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => void refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <p className="font-semibold text-foreground">
              Todavía no hay nada por acá
            </p>
            <p className="mt-1 text-sm text-muted">
              Registrá tu primera comida y empezamos a mostrarte actividad.
            </p>
          </div>
        ) : (
          reviews.map((review: FeedItem) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </section>
  );
}
