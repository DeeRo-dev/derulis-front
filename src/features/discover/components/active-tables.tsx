import { Link } from "react-router-dom";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import { AvatarStack } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useActiveTables } from "@/features/tables/hooks/use-tables";
import type { Table } from "@/features/tables/types";

function TableCard({ table }: { table: Table }) {
  const deciding = table.status === "deciding";
  const StatusIcon = deciding ? FiMapPin : FiCheckCircle;

  return (
    <Link
      to={`/tables/${table.id}`}
      className="flex w-56 shrink-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-md shadow-lilac-200/40 transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <AvatarStack people={table.members} />

      <div>
        <p className="truncate font-semibold text-foreground">{table.name}</p>
        <p
          className={cn(
            "mt-1 flex items-center gap-1.5 text-xs",
            deciding ? "text-lilac-700" : "text-success",
          )}
        >
          <StatusIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{table.statusDetail}</span>
        </p>
      </div>
    </Link>
  );
}

export function ActiveTables() {
  const { data: tables, isPending, isError } = useActiveTables();

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Mesas activas
        </h2>
        <Link
          to="/tables"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Ver todas
        </Link>
      </div>

      {/* -mx-5 + px-5: el carrusel sangra hasta el borde de la pantalla. */}
      <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2">
        {isPending ? (
          <>
            <Skeleton className="h-28 w-56 shrink-0 rounded-2xl" />
            <Skeleton className="h-28 w-56 shrink-0 rounded-2xl" />
          </>
        ) : isError ? (
          <p className="text-sm text-muted">No pudimos cargar tus mesas.</p>
        ) : tables.length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no tenés mesas abiertas.
          </p>
        ) : (
          tables.map((table) => <TableCard key={table.id} table={table} />)
        )}
      </div>
    </section>
  );
}
