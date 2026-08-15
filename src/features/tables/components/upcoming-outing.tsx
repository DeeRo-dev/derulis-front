import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiNavigation,
  FiShare2,
  FiCheck,
} from "react-icons/fi";
import { PiHeartFill, PiForkKnifeFill } from "react-icons/pi";
import { PlacePhoto } from "@/components/ui/place-photo";
import { formatDateTime, priceLevel } from "@/lib/format";
import type { UpcomingOuting as UpcomingOutingType } from "../types";

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function ShareButton({ outing }: { outing: UpcomingOutingType }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `${outing.place.name} — ${formatDateTime(outing.dateTime)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: outing.place.name, text });
        return;
      } catch {
        // El usuario canceló: no es un error que valga la pena mostrar.
        return;
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      aria-label={copied ? "Copiado" : "Compartir"}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lilac-100 text-lilac-700 transition hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {copied ? (
        <FiCheck className="h-5 w-5" aria-hidden="true" />
      ) : (
        <FiShare2 className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

export function UpcomingOuting({
  tableId,
  outing,
}: {
  tableId: number;
  outing: UpcomingOutingType | null;
}) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
        <FiCalendar className="h-5 w-5 text-primary" aria-hidden="true" />
        Próxima salida
      </h2>

      {!outing ? (
        <div className="mt-3 rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
          <p className="font-semibold text-foreground">Todavía no hay plan</p>
          <p className="mt-1 text-sm text-muted">
            Elegí un lugar y ponele fecha para que todos sepan.
          </p>
          <Link
            to={`/tables/${tableId}/outings/new`}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Proponer un lugar
          </Link>
        </div>
      ) : (
        <article className="mt-3 overflow-hidden rounded-3xl bg-white p-4 shadow-lg shadow-lilac-200/50">
          <div className="relative h-44 overflow-hidden rounded-2xl">
            <PlacePhoto src={outing.place.photoUrl} alt={outing.place.name} />
            {outing.booked ? (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur">
                <PiHeartFill
                  className="h-3.5 w-3.5 text-error"
                  aria-hidden="true"
                />
                Reservado
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {outing.place.name}
            </h3>
            {outing.estimatedSpend ? (
              <span className="shrink-0 pt-1 text-sm font-bold text-muted">
                {priceLevel(outing.estimatedSpend)}
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-sm text-muted">
            {outing.place.cuisines.join(" • ")}
          </p>

          <dl className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <dt className="sr-only">Fecha</dt>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lilac-100"
                aria-hidden="true"
              >
                <FiCalendar className="h-4 w-4 text-lilac-700" />
              </span>
              {/* first-letter y no `capitalize`: este último pondría
                  mayúscula en cada palabra ("24 De Octubre"). */}
              <dd className="text-sm font-medium text-foreground first-letter:uppercase">
                {formatDateTime(outing.dateTime)}
              </dd>
            </div>

            <div className="flex items-center gap-3">
              <dt className="sr-only">Dirección</dt>
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lilac-100"
                aria-hidden="true"
              >
                <FiMapPin className="h-4 w-4 text-lilac-700" />
              </span>
              <dd className="text-sm text-foreground">
                {outing.place.address}
              </dd>
            </div>
          </dl>

          <Link
            to={`/outings/${outing.id}/review`}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <PiForkKnifeFill className="h-5 w-5" aria-hidden="true" />
            Cargar lo que comieron
          </Link>

          <div className="mt-3 flex items-center gap-3">
            <a
              href={mapsUrl(outing.place.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white px-6 text-base font-semibold text-primary transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FiNavigation className="h-5 w-5" aria-hidden="true" />
              Cómo llegar
            </a>
            <ShareButton outing={outing} />
          </div>
        </article>
      )}
    </section>
  );
}
