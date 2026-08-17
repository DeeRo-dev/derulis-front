import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMapPin, FiWifiOff, FiAlertCircle } from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { PlacePhoto } from "@/components/ui/place-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaces } from "@/features/places/hooks/use-places";
import { getApiErrorMessage, isNetworkError } from "@/lib/apiClient";
import { fadeVariants, itemVariants, listVariants, tap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PlaceWithScore } from "@/features/places/types";

const PER_PAGE = 4;

/** "Buenos Aires, Argentina" — cae a la dirección si no hay ciudad cargada. */
function location(place: PlaceWithScore): string {
  return [place.city, place.country].filter(Boolean).join(", ") || place.address;
}

function PlaceCard({ place }: { place: PlaceWithScore }) {
  return (
    <motion.article
      variants={itemVariants}
      whileTap={tap}
      className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-lilac-200/50 transition-shadow focus-within:ring-2 focus-within:ring-primary hover:shadow-xl"
    >
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

        {/* Una reseña suelta de la comunidad, cortada a dos líneas: alcanza
            para darse una idea del lugar sin desbalancear la tarjeta. */}
        {place.comment ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/80">
            {place.comment}
          </p>
        ) : null}

        {place.derulis !== null ? (
          <DerulisRating value={place.derulis} className="mt-3" />
        ) : (
          <p className="mt-3 text-sm text-muted">Todavía sin reseñas</p>
        )}
      </div>
    </motion.article>
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
    <section className="mt-8">
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

      <div className="mt-4 space-y-5">
        {query.isPending ? (
          <>
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </>
        ) : query.isError ? (
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50"
          >
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
          </motion.div>
        ) : query.data.items.length === 0 ? (
          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50"
          >
            <p className="font-semibold text-foreground">
              {search ? "No encontramos nada" : "Todavía no hay reseñas"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {search
                ? "Probá con otro nombre."
                : "Registrá un lugar y puntuá lo que comiste para empezar."}
            </p>
          </motion.div>
        ) : (
          /* La key incluye página y búsqueda: al cambiar de una a otra, la
             tanda de tarjetas vuelve a entrar escalonada en vez de mutar
             el texto en su lugar. */
          <AnimatePresence mode="wait">
            <motion.div
              key={`${search}-${page}`}
              variants={listVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="space-y-5"
            >
              {query.data.items.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </motion.div>
          </AnimatePresence>
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
              <motion.button
                key={number}
                type="button"
                role="tab"
                aria-selected={number === page}
                aria-label={`Página ${number}`}
                onClick={() => onPageChange(number)}
                whileTap={{ scale: 0.85 }}
                animate={{ width: number === page ? 24 : 8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  number === page
                    ? "bg-primary"
                    : "bg-lilac-300 transition-colors hover:bg-lilac-400",
                )}
              />
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
