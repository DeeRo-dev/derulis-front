import { Link } from "react-router-dom";
import { FiClock, FiChevronRight } from "react-icons/fi";
import { DerulisRating } from "@/components/ui/derulis-rating";
import { PlacePhoto } from "@/components/ui/place-photo";
import { formatDate } from "@/lib/format";
import type { PastVisit } from "../types";

export function PastVisits({
  tableId,
  visits,
}: {
  tableId: number;
  visits: PastVisit[];
}) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <FiClock className="h-5 w-5 text-primary" aria-hidden="true" />
          Visitas anteriores
        </h2>
        {visits.length > 0 ? (
          <Link
            to={`/tables/${tableId}/visits`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver todas
          </Link>
        ) : null}
      </div>

      {visits.length === 0 ? (
        <p className="mt-3 rounded-3xl bg-white p-8 text-center text-sm text-muted shadow-lg shadow-lilac-200/50">
          Esta mesa todavía no visitó ningún lugar.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {visits.map((visit) => (
            <li key={visit.id}>
              <article className="relative flex items-center gap-3 rounded-2xl bg-white p-3 shadow-md shadow-lilac-200/40 transition focus-within:ring-2 focus-within:ring-primary hover:shadow-lg">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <PlacePhoto
                    src={visit.place.photoUrl}
                    alt={visit.place.name}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-foreground">
                    <Link
                      to={`/places/${visit.place.id}`}
                      className="after:absolute after:inset-0 focus:outline-none"
                    >
                      {visit.place.name}
                    </Link>
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(visit.date)}
                  </p>
                  {visit.derulis === null ? (
                    <p className="mt-1 text-xs text-muted">Sin puntuar</p>
                  ) : (
                    <DerulisRating
                      value={visit.derulis}
                      size="sm"
                      className="mt-1"
                    />
                  )}
                </div>

                <FiChevronRight
                  className="h-5 w-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
