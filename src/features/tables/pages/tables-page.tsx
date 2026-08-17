import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiChevronRight, FiWifiOff } from "react-icons/fi";
import { itemVariants, listVariants, tap } from "@/lib/motion";
import { PiQrCodeBold } from "react-icons/pi";
import { AvatarStack } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlacePhoto } from "@/components/ui/place-photo";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveTables } from "../hooks/use-tables";
import type { Table } from "../types";

function ActionCard({
  to,
  label,
  icon,
  highlighted,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <motion.div variants={itemVariants} whileTap={tap}>
      <Link
        to={to}
        className={
          "flex h-full flex-col items-center justify-center gap-3 rounded-3xl px-4 py-6 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
          (highlighted
            ? "bg-lilac-100 text-primary hover:bg-lilac-200"
            : "bg-white text-foreground shadow-lg shadow-lilac-200/50 hover:shadow-xl")
        }
      >
        <span
          className={
            "flex h-12 w-12 items-center justify-center rounded-full " +
            (highlighted
              ? "bg-white text-primary"
              : "bg-lilac-100 text-lilac-700")
          }
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </Link>
    </motion.div>
  );
}

function TableRow({ table }: { table: Table }) {
  const subtitle = table.lastVisit
    ? `Última: ${table.lastVisit.place.name}`
    : table.upcomingOuting
      ? `Próxima: ${table.upcomingOuting.place.name}`
      : table.statusDetail;

  return (
    <motion.li variants={itemVariants} whileTap={tap}>
      <article className="relative flex items-center gap-3 rounded-3xl bg-white p-3 shadow-lg shadow-lilac-200/50 transition-shadow focus-within:ring-2 focus-within:ring-primary hover:shadow-xl">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
          <PlacePhoto
            src={table.lastVisit?.place.photoUrl ?? null}
            alt={table.name}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground">
            <Link
              to={`/tables/${table.id}`}
              className="after:absolute after:inset-0 focus:outline-none"
            >
              {table.name}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>

          <div className="mt-2 flex items-center gap-2">
            <AvatarStack people={table.members} />
            <span className="text-xs text-muted">
              {table.members.length}{" "}
              {table.members.length === 1 ? "integrante" : "integrantes"}
            </span>
          </div>
        </div>

        <FiChevronRight
          className="h-5 w-5 shrink-0 text-muted"
          aria-hidden="true"
        />
      </article>
    </motion.li>
  );
}

export function TablesPage() {
  const { data: tables, isPending, isError, refetch } = useActiveTables();

  return (
    <motion.div variants={listVariants} initial="initial" animate="animate">
      <motion.h1
        variants={itemVariants}
        className="pt-4 text-3xl font-bold tracking-tight text-foreground"
      >
        Mis mesas
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-2 text-base leading-6 text-muted"
      >
        Gestioná tus grupos y descubran nuevos lugares juntos.
      </motion.p>

      <motion.div
        variants={listVariants}
        className="mt-6 grid grid-cols-2 gap-3"
      >
        <ActionCard
          to="/tables/new"
          label="Crear mesa"
          highlighted
          icon={<FiPlus className="h-6 w-6" />}
        />
        <ActionCard
          to="/tables/join"
          label="Unirme con código"
          icon={<PiQrCodeBold className="h-6 w-6" />}
        />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="mt-8 text-lg font-bold tracking-tight text-foreground"
      >
        Mesas activas
      </motion.h2>

      <div className="mt-3">
        {isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-3xl" />
            <Skeleton className="h-24 rounded-3xl" />
          </div>
        ) : isError ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <FiWifiOff
              className="mx-auto h-8 w-8 text-lilac-400"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-foreground">Sin conexión</p>
            <p className="mt-1 text-sm text-muted">
              Revisá tu internet y volvé a intentar.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => void refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : tables.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <p className="font-semibold text-foreground">
              Todavía no tenés mesas
            </p>
            <p className="mt-1 text-sm text-muted">
              Creá una para invitar a tus amigos, o sumate con un código.
            </p>
          </div>
        ) : (
          <motion.ul variants={listVariants} className="space-y-3">
            {tables.map((table) => (
              <TableRow key={table.id} table={table} />
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}
