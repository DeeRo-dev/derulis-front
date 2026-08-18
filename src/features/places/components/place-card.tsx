import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { PlacePhoto } from "@/components/ui/place-photo";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { itemVariants, tap } from "@/lib/motion";
import type { PlaceWithScore } from "../types";

/** "Buenos Aires, Argentina" — cae a la dirección si no hay ciudad cargada. */
function location(place: PlaceWithScore): string {
  return [place.city, place.country].filter(Boolean).join(", ") || place.address;
}

/**
 * La tarjeta del listado. La comparten Descubrir y Favoritos: son la misma
 * lectura —foto, nombre, dónde queda, qué opinó la gente— y tenerla dos
 * veces garantizaba que se despeguen.
 */
export function PlaceCard({ place }: { place: PlaceWithScore }) {
  return (
    <motion.article
      variants={itemVariants}
      whileTap={tap}
      className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-lilac-200/50 transition-shadow focus-within:ring-2 focus-within:ring-primary hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden rounded-2xl">
        <PlacePhoto src={place.photoUrl} alt={place.name} />

        {place.derulis !== null ? (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-foreground backdrop-blur">
            <PiForkKnifeFill
              className="h-3.5 w-3.5 text-derulis"
              aria-hidden="true"
            />
            {place.derulis.toFixed(1)}
          </span>
        ) : null}

        {/* A la derecha: es donde cae el pulgar, y guardar es la acción. */}
        <FavoriteButton
          placeId={place.id}
          placeName={place.name}
          className="absolute right-3 top-3"
        />
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
