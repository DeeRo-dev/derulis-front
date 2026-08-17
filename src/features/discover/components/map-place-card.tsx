import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { PlacePhoto } from "@/components/ui/place-photo";
import { formatDistance } from "@/lib/geo";
import { EASE, tap } from "@/lib/motion";
import type { PlaceWithScore } from "@/features/places/types";

/** Tarjeta flotante del lugar elegido en el mapa. */
export function MapPlaceCard({
  place,
  distanceKm,
}: {
  place: PlaceWithScore;
  distanceKm: number | null;
}) {
  return (
    /* Sube desde el borde inferior: se lee como respuesta al pin que tocaste. */
    <motion.article
      key={place.id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      whileTap={tap}
      className="relative flex items-center gap-3 rounded-3xl bg-white p-3 shadow-2xl shadow-lilac-900/10 ring-1 ring-lilac-100"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
        <PlacePhoto src={place.photoUrl} alt={place.name} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-bold tracking-tight text-foreground">
          <Link
            to={`/places/${place.id}`}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {place.name}
          </Link>
        </h2>

        <p className="mt-0.5 truncate text-sm text-muted">
          {[place.city, place.province].filter(Boolean).join(", ") ||
            place.address}
        </p>

        <div className="mt-2 flex items-center gap-3 text-sm">
          {place.derulis !== null ? (
            <span className="flex items-center gap-1 font-bold text-foreground">
              <PiForkKnifeFill
                className="h-4 w-4 text-derulis"
                aria-hidden="true"
              />
              {place.derulis.toFixed(1)}
              <span className="font-normal text-muted">
                ({place.visitCount})
              </span>
            </span>
          ) : (
            <span className="text-muted">Sin puntuar</span>
          )}

          {distanceKm !== null ? (
            <span className="text-muted">{formatDistance(distanceKm)}</span>
          ) : null}
        </div>
      </div>

      <FiChevronRight
        className="h-5 w-5 shrink-0 text-muted"
        aria-hidden="true"
      />
    </motion.article>
  );
}
