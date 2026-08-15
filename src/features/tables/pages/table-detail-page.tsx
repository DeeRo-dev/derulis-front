import { useNavigate, useParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { isNotFound } from "@/lib/apiClient";
import { useTable } from "../hooks/use-tables";
import { TableHero } from "../components/table-hero";
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

  if (isPending) {
    return (
      <>
        <Skeleton className="-mx-5 h-52 rounded-b-3xl" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-6 h-20 rounded-2xl" />
          <Skeleton className="mt-6 h-72 rounded-3xl" />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <DetailTopBar />
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {notFound ? "Mesa no encontrada" : "No pudimos cargar la mesa"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {notFound
              ? "Puede que la hayan cerrado, que el enlace esté mal o que no seas parte de esta mesa."
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
      </>
    );
  }

  return (
    <>
      <TableHero
        tableId={table.id}
        name={table.name}
        photoUrl={table.photoUrl}
        fallbackPhotoUrl={table.lastVisit?.place.photoUrl}
      />

      <div className="mt-5">
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
      </div>

      <TableMembers tableId={table.id} members={table.members} />

      {table.inviteCode ? <InviteCode code={table.inviteCode} /> : null}

      <UpcomingOuting tableId={table.id} outing={table.upcomingOuting} />
      <PastVisits tableId={table.id} visits={table.pastVisits} />
    </>
  );
}
