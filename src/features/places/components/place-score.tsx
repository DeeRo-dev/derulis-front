/** El número grande: promedio global del lugar. */
export function PlaceScore({
  derulis,
  visitCount,
}: {
  derulis: number | null;
  visitCount: number;
}) {
  const mesas = visitCount === 1 ? "mesa" : "mesas";

  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-lilac-100 ring-8 ring-lilac-50">
        {derulis === null ? (
          <span className="px-4 text-sm font-medium text-muted">
            Sin puntuar
          </span>
        ) : (
          <span className="text-5xl font-bold tracking-tight text-primary">
            {derulis.toFixed(1)}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-muted">
        {visitCount === 0
          ? "Todavía no lo visitó ninguna mesa"
          : `Promedio de ${visitCount} ${mesas}`}
      </p>
    </div>
  );
}
