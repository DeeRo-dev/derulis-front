import { Link, useNavigate, useParams } from "react-router-dom";
import { FiUserPlus, FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { isNotFound } from "@/lib/apiClient";
import { useTable } from "../hooks/use-tables";
import { TableMembers } from "../components/table-members";
import { UpcomingOuting } from "../components/upcoming-outing";
import { PastVisits } from "../components/past-visits";
import { InviteCode } from "../components/invite-code";

export function TableDetailPage() {
  const navigate = useNavigate();
  const { tableId } = useParams();
  const { data: table, isPending, isError, error } = useTable(Number(tableId));

  // El backend responde 404 tanto si no existe como si no sos miembro:
  // un extraño no debería poder confirmar que la mesa existe.
  const notFound = isError && isNotFound(error);

  return (
    <>
      <DetailTopBar>
        {table ? (
          <Link
            to={`/tables/${table.id}/invite`}
            aria-label="Invitar comensales"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-lilac-100 text-lilac-700 transition hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FiUserPlus className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : null}
      </DetailTopBar>

      {isPending ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-6 h-12 w-40 rounded-full" />
          <Skeleton className="mt-6 h-72 rounded-3xl" />
        </div>
      ) : notFound ? (
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mesa no encontrada
          </h1>
          <p className="mt-2 text-sm text-muted">
            Puede que la hayan cerrado, que el enlace esté mal o que no seas
            parte de esta mesa.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate("/discover")}
          >
            Ir a Descubrir
          </Button>
        </div>
      ) : isError ? (
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            No pudimos cargar la mesa
          </h1>
          <p className="mt-2 text-sm text-muted">
            Revisá tu conexión y volvé a intentar.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4">
            {table.isPrivate ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <FiLock className="h-3 w-3" aria-hidden="true" />
                Grupo privado
              </span>
            ) : null}

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              {table.name}
            </h1>

            {table.description ? (
              <p className="mt-3 text-base leading-7 text-muted">
                {table.description}
              </p>
            ) : null}

            {table.inviteCode ? <InviteCode code={table.inviteCode} /> : null}
          </div>

          <TableMembers tableId={table.id} members={table.members} />
          <UpcomingOuting tableId={table.id} outing={table.upcomingOuting} />
          <PastVisits tableId={table.id} visits={table.pastVisits} />
        </>
      )}
    </>
  );
}
