import { Link } from "react-router-dom";
import { FiCalendar, FiX } from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { PlacePhoto } from "@/components/ui/place-photo";
import { formatDateTime } from "@/lib/format";
import { useCancelOuting } from "../hooks/use-tables";
import type { UpcomingOuting } from "../types";

/**
 * La salida que ya ocurrió y sigue abierta.
 *
 * Antes esta misma salida se anunciaba como "Próxima salida" para siempre:
 * pasaba la fecha y nada la movía de ahí, porque lo único que la cerraba
 * era un botón al fondo de la pantalla de reseña. Ahora, al día siguiente,
 * la mesa se encuentra con esto y con lo único que le falta hacer.
 */
export function PendingOuting({
  tableId,
  outing,
}: {
  tableId: number;
  outing: UpcomingOuting;
}) {
  const cancel = useCancelOuting(tableId);

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
        <PiForkKnifeFill className="h-5 w-5 text-primary" aria-hidden="true" />
        ¿Cómo estuvo?
      </h2>
      <p className="mt-1 text-sm text-muted">
        Ya pasó la fecha. Carguen lo que comieron para que cuente en el
        promedio del lugar.
      </p>

      <article className="mt-3 overflow-hidden rounded-3xl bg-white p-4 shadow-lg shadow-lilac-200/50">
        <div className="relative h-36 overflow-hidden rounded-2xl">
          <PlacePhoto src={outing.place.photoUrl} alt={outing.place.name} />
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">
          {outing.place.name}
        </h3>

        <p className="mt-1 flex items-center gap-2 text-sm text-muted first-letter:uppercase">
          <FiCalendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          {formatDateTime(outing.dateTime)}
        </p>

        <Link
          to={`/outings/${outing.id}/review`}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <PiForkKnifeFill className="h-5 w-5" aria-hidden="true" />
          Cargar lo que comieron
        </Link>

        {/* La salida cuenta como visita sola al día siguiente: hace falta
            poder decir que no fueron, o un plan que se cayó quedaría
            registrado como una visita al lugar. */}
        <button
          type="button"
          onClick={() => cancel.mutate(outing.id)}
          disabled={cancel.isPending}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white px-6 text-base font-semibold text-muted transition-colors hover:bg-lilac-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiX className="h-5 w-5" aria-hidden="true" />
          {cancel.isPending ? "Cancelando…" : "No fuimos"}
        </button>
      </article>
    </section>
  );
}
