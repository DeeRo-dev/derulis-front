import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiWifiOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { PlacePhoto } from "@/components/ui/place-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaces } from "@/features/places/hooks/use-places";
import { getApiErrorMessage, isNetworkError } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import type { PlaceWithScore } from "@/features/places/types";

const PER_PAGE = 4;

/** "Buenos Aires, Argentina" — cae a la dirección si no hay ciudad cargada. */
function location(place: PlaceWithScore): string {
  return [place.city, place.country].filter(Boolean).join(", ") || place.address;
}

function PlaceCard({ place }: { place: PlaceWithScore }) {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-lilac-200/50 transition focus-within:ring-2 focus-within:ring-primary hover:shadow-xl">
      <div className="relative h-44 overflow-hidden rounded-2xl">
        <PlacePhoto src={place.photoUrl} alt={place.name} />
        {place.derulis !== null ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-foreground backdrop-blur">
            <PiForkKnifeFill
              className="h-3.5 w-3.5 text-derulis"
              aria-hidden="true"
            />
            {place.derulis.toFixed(1)}
          </span>
        ) : null}
      </div>

      <div className="px-2 pb-1 pt-4">
        <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
          <Link
            to={`/places/${place.id}`}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {place.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{location(place)}</span>
        </p>

        {place.derulis !== null ? (
          <DerulisRating value={place.derulis} className="mt-3" />
        ) : (
          <p className="mt-3 text-sm text-muted">Todavía sin reseñas</p>
        )}
      </div>
    </article>
  );
}

export function TopPlaces({
  search,
  page,
  onPageChange,
}: {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
}) {
  const query = usePlaces({
    search: search || undefined,
    // Con búsqueda mostramos todo lo que coincida; sin ella, los mejores.
    sort: search ? "name" : "top",
    page,
    limit: PER_PAGE,
  });

  const totalPages = query.data ? Math.ceil(query.data.total / PER_PAGE) : 0;

  return (
    <section className="mt-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {search ? "Resultados" : "Mejores reseñas"}
          </h2>
          <p className="text-sm text-muted">
            {search
              ? `${query.data?.total ?? 0} lugares encontrados`
              : "Lugares destacados por la comunidad"}
          </p>
        </div>

        {!search && query.data && query.data.total > PER_PAGE ? (
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!query.data.hasMore}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition hover:underline disabled:opacity-40 disabled:hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver más
            <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-5">
        {query.isPending ? (
          <>
            <Skeleton className="h-72 rounded-3xl" />
            <Skeleton className="h-72 rounded-3xl" />
          </>
        ) : query.isError ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            {isNetworkError(query.error) ? (
              <>
                <FiWifiOff
                  className="mx-auto h-8 w-8 text-lilac-400"
                  aria-hidden="true"
                />
                <p className="mt-3 font-semibold text-foreground">
                  Sin conexión
                </p>
                <p className="mt-1 text-sm text-muted">
                  Revisá tu internet y volvé a intentar.
                </p>
              </>
            ) : (
              <>
                <FiAlertCircle
                  className="mx-auto h-8 w-8 text-lilac-400"
                  aria-hidden="true"
                />
                <p className="mt-3 font-semibold text-foreground">
                  No pudimos cargar los lugares
                </p>
                <p className="mt-1 text-sm text-muted">
                  {getApiErrorMessage(
                    query.error,
                    "Hubo un problema del lado del servidor.",
                  )}
                </p>
              </>
            )}
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => void query.refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : query.data.items.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <p className="font-semibold text-foreground">
              {search ? "No encontramos nada" : "Todavía no hay reseñas"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {search
                ? "Probá con otro nombre."
                : "Registrá un lugar y puntuá lo que comiste para empezar."}
            </p>
          </div>
        ) : (
          query.data.items.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div
          role="tablist"
          aria-label="Páginas de lugares"
          className="mt-6 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                type="button"
                role="tab"
                aria-selected={number === page}
                aria-label={`Página ${number}`}
                onClick={() => onPageChange(number)}
                className={cn(
                  "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  number === page
                    ? "w-6 bg-primary"
                    : "w-2 bg-lilac-300 hover:bg-lilac-400",
                )}
              />
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
