import { PiForkKnifeFill } from "react-icons/pi";

/**
 * El promedio del lugar, al lado del título de las reseñas.
 *
 * Antes era un círculo grande y centrado, pero empujaba las reseñas —
 * lo que la gente viene a leer — fuera de la primera pantalla.
 */
export function PlaceScore({
  derulis,
  visitCount,
}: {
  derulis: number | null;
  visitCount: number;
}) {
  const mesas = visitCount === 1 ? "mesa" : "mesas";

  if (derulis === null) {
    return (
      <span className="shrink-0 rounded-full bg-lilac-100 px-3 py-1.5 text-sm font-medium text-muted">
        Sin puntuar
      </span>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full bg-lilac-100 py-1.5 pl-1.5 pr-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
        {derulis.toFixed(1)}
      </span>
      <span className="text-xs leading-tight text-muted">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <PiForkKnifeFill
            className="h-3 w-3 text-derulis"
            aria-hidden="true"
          />
          Promedio
        </span>
        {visitCount} {mesas}
      </span>
    </div>
  );
}
