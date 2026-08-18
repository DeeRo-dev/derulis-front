import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiWifiOff, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceCard } from "@/features/places/components/place-card";
import { getApiErrorMessage, isNetworkError } from "@/lib/apiClient";
import { itemVariants, listVariants } from "@/lib/motion";
import { useFavorites } from "../hooks/use-favorites";

export function FavoritesPage() {
  const query = useFavorites();
  const total = query.data?.length ?? 0;

  return (
    <motion.div variants={listVariants} initial="initial" animate="animate">
      <motion.h1
        variants={itemVariants}
        className="pt-4 text-3xl font-bold tracking-tight text-foreground"
      >
        Favoritos
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-2 text-base leading-6 text-muted"
      >
        {total > 0
          ? `${total} ${total === 1 ? "lugar guardado" : "lugares guardados"} para volver.`
          : "Los lugares que guardaste para volver."}
      </motion.p>

      <div className="mt-6 space-y-5">
        {query.isPending ? (
          <>
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </>
        ) : /* El error solo tapa la pantalla si no hay nada que mostrar. Si
              la lista ya estaba cargada y falla una recarga de fondo, dejarla
              es mejor que reemplazarla por un cartel de "sin conexión". */
        query.isError && !query.data ? (
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
              <p className="font-semibold text-foreground">
                {getApiErrorMessage(
                  query.error,
                  "No pudimos cargar tus favoritos.",
                )}
              </p>
            )}
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => void query.refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : query.data.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50"
          >
            <FiHeart
              className="mx-auto h-8 w-8 text-lilac-400"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-foreground">
              Todavía no guardaste ninguno
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Tocá el corazón en cualquier lugar y va a aparecer acá, listo
              para cuando quieras volver.
            </p>
            <Link
              to="/discover"
              className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Descubrir lugares
              <FiArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </motion.div>
        ) : (
          query.data.map((place) => <PlaceCard key={place.id} place={place} />)
        )}
      </div>
    </motion.div>
  );
}
