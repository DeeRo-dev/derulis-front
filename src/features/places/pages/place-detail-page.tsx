import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShare2,
  FiCheck,
  FiMapPin,
  FiInstagram,
  FiExternalLink,
  FiCalendar,
  FiMap,
  FiPhone,
} from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlacePhoto } from "@/components/ui/place-photo";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { isNotFound } from "@/lib/apiClient";
import { priceLevel } from "@/lib/format";
import { EASE, itemVariants, listVariants } from "@/lib/motion";
import { usePlaceReviews } from "../hooks/use-places";
import { useLocatePlace } from "../hooks/use-locate-place";
import { PlaceScore } from "../components/place-score";
import { TableReviewCard } from "../components/table-review-card";
import { ScheduleVisitSheet } from "../components/schedule-visit-sheet";
import { PlaceGallery } from "../components/place-gallery";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import type { TableReview } from "../types";

/** Un lugar es "muy bien puntuado" a partir de 4.5, como en el listado. */
const HIGHLY_RATED = 4.5;

/**
 * "$$$" a partir de lo que gastaron las mesas que ya fueron. Es un dato
 * real, no una etiqueta cargada a mano: sale del gasto por comensal
 * promediado entre las visitas que anotaron cuánto salió.
 */
function priceRange(tables: TableReview[]): string | null {
  const perDiner = tables
    .filter((table) => table.totalSpend !== null && table.diners.length > 0)
    .map((table) => table.totalSpend! / table.diners.length);

  if (perDiner.length === 0) return null;

  const average =
    perDiner.reduce((total, value) => total + value, 0) / perDiner.length;

  return priceLevel(average);
}

function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
        // Cancelar no es un error que valga la pena mostrar.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      aria-label={copied ? "Copiado" : "Compartir lugar"}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {copied ? (
        <FiCheck className="h-5 w-5" aria-hidden="true" />
      ) : (
        <FiShare2 className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

export function PlaceDetailPage() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const { data, isPending, isError, error } = usePlaceReviews(Number(placeId));
  const [scheduling, setScheduling] = useState(false);

  /* Los lugares cargados sin marcar el punto en el mapa no se pueden
     señalar. Se intenta ubicarlos por su dirección; si sale, la dirección
     pasa a ser un link al mapa. Va antes de los returns tempranos porque
     los hooks no pueden quedar condicionados. */
  const needsLocation = data
    ? data.place.latitude === null || data.place.longitude === null
    : false;
  useLocatePlace(Number(placeId), needsLocation);

  if (isPending) {
    return (
      <section>
        <DetailTopBar />
        <div className="space-y-4">
          <Skeleton className="-mx-5 h-64 rounded-b-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <DetailTopBar />
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isNotFound(error) ? "Lugar no encontrado" : "No pudimos cargarlo"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isNotFound(error)
              ? "Puede que lo hayan borrado o que el enlace esté mal."
              : "Revisá tu conexión y volvé a intentar."}
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate("/discover")}
          >
            Ir a Descubrir
          </Button>
        </div>
      </section>
    );
  }

  const { place, derulis, visitCount, tables } = data;
  const price = priceRange(tables);
  const area = [place.city, place.province].filter(Boolean).join(", ");
  const mappable = place.latitude !== null && place.longitude !== null;
  /* El backend todavía no modela las etiquetas de cocina: hasta que existan,
     el subtítulo se arma con lo que sí hay. */
  const subtitle = [place.cuisines.join(", "), price]
    .filter(Boolean)
    .join(" • ");

  return (
    <motion.section variants={listVariants} initial="initial" animate="animate">
      <DetailTopBar>
        <FavoriteButton
          placeId={place.id}
          placeName={place.name}
          variant="bare"
          className="h-10 w-10"
        />
        <ShareButton name={place.name} />
      </DetailTopBar>

      {/* -mx-5: la foto sangra hasta los bordes de la pantalla. */}
      <motion.div
        variants={itemVariants}
        className="relative -mx-5 h-64 overflow-hidden rounded-b-3xl"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="h-full w-full"
        >
          <PlacePhoto src={place.photoUrl} alt={place.name} />
        </motion.div>

        {/* El degradado no decora: sin él el nombre no se lee sobre fotos claras. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow">
            {place.name}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-white/90">{subtitle}</p>
          ) : null}
        </div>
      </motion.div>

      {place.description ? (
        <motion.p
          variants={itemVariants}
          className="mt-5 text-sm leading-6 text-muted"
        >
          {place.description}
        </motion.p>
      ) : null}

      <motion.section
        variants={itemVariants}
        className="mt-5 rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50"
      >
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Ubicación y contacto
        </h2>

        {/* `items-center`: con una sola línea de texto, alinear arriba deja
            la dirección despegada del ícono. */}
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-700"
          >
            <FiMapPin className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground">{place.address}</p>
            {area ? <p className="text-xs text-muted">{area}</p> : null}
          </div>
        </div>

        {place.phone ? (
          <>
            <hr className="my-4 border-lilac-100" />
            {/* `tel:` y no texto suelto: en el celular llamar es un toque. */}
            <a
              href={`tel:${place.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-xl transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-700"
              >
                <FiPhone className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {place.phone}
              </span>
            </a>
          </>
        ) : null}

        {place.instagram ? (
          <>
            <hr className="my-4 border-lilac-100" />
            <a
              href={`https://instagram.com/${place.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-700"
              >
                <FiInstagram className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                @{place.instagram}
              </span>
              <FiExternalLink
                className="h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
            </a>
          </>
        ) : null}

        {/* Un botón propio y no la fila entera clickeable: la acción tiene
            que verse, no descubrirse tocando el texto. */}
        {mappable ? (
          <Link
            to={`/search?place=${place.id}`}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white text-sm font-semibold text-primary transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FiMap className="h-4 w-4 shrink-0" aria-hidden="true" />
            Ver en el mapa
          </Link>
        ) : (
          /* Sin coordenadas no hay nada que señalar: se dice por qué, en vez
             de un botón que lleva a un mapa vacío. */
          <p className="mt-5 rounded-xl bg-lilac-50 px-4 py-3 text-center text-sm text-muted">
            Todavía no tiene el punto marcado en el mapa.
          </p>
        )}
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="mt-4 rounded-3xl bg-lilac-100 p-5"
      >
        <h2 className="text-lg font-bold tracking-tight text-primary">
          Reservar una mesa
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Elegí con qué mesa venís y cuándo. Cada comensal recibe la invitación
          y confirma si va.
        </p>

        <Button className="mt-4 w-full" onClick={() => setScheduling(true)}>
          <FiCalendar className="h-5 w-5" aria-hidden="true" />
          Agendar cita
        </Button>
      </motion.section>

      {derulis !== null && derulis >= HIGHLY_RATED ? (
        <motion.div variants={itemVariants} className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-derulis/40 bg-derulis/10 px-3 py-1 text-xs font-semibold text-foreground">
            <PiForkKnifeFill
              className="h-3.5 w-3.5 text-derulis"
              aria-hidden="true"
            />
            Muy bien puntuado
          </span>
        </motion.div>
      ) : null}

      <motion.div variants={itemVariants}>
        <PlaceGallery placeId={place.id} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 flex items-center justify-between gap-3"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Reseñas por mesa
        </h2>
        <PlaceScore derulis={derulis} visitCount={visitCount} />
      </motion.div>

      {tables.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="mt-4 rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50"
        >
          <p className="font-semibold text-foreground">Todavía sin reseñas</p>
          <p className="mt-1 text-sm text-muted">
            Cuando una mesa lo visite y puntúe, va a aparecer acá.
          </p>
        </motion.div>
      ) : (
        <motion.div variants={listVariants} className="mt-4 space-y-5">
          {tables.map((review) => (
            <TableReviewCard key={review.outingId} review={review} />
          ))}
        </motion.div>
      )}

      <ScheduleVisitSheet
        placeId={place.id}
        placeName={place.name}
        open={scheduling}
        onOpenChange={setScheduling}
      />
    </motion.section>
  );
}
