import { AnimatePresence, motion } from "framer-motion";
import { FiWifiOff, FiAlertCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaces } from "@/features/places/hooks/use-places";
import { PlaceCard } from "@/features/places/components/place-card";
import { getApiErrorMessage, isNetworkError } from "@/lib/apiClient";
import { fadeVariants, listVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PER_PAGE = 4;

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
