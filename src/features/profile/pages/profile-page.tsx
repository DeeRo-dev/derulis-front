import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { PiForkKnifeFill, PiNotePencilFill } from "react-icons/pi";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import { getMyStats } from "../api/profile.api";
import type { UserStats } from "../api/profile.api";

const CARDS = [
  {
    key: "placesVisited",
    label: "Lugares visitados",
    Icon: FiMapPin,
  },
  {
    key: "reviewsCount",
    label: "Reseñas",
    Icon: PiNotePencilFill,
  },
  {
    key: "mealsRated",
    label: "Platos puntuados",
    Icon: PiForkKnifeFill,
  },
  {
    key: "tablesCount",
    label: "Mesas",
    Icon: FiUsers,
  },
] as const satisfies readonly {
  key: keyof UserStats;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[];

export function ProfilePage() {
  const user = useCurrentUser();
  const logout = useLogout();

  const stats = useQuery({
    queryKey: ["users", "me", "stats"],
    queryFn: getMyStats,
  });

  return (
    <section className="mt-6">
      <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
        <Avatar
          name={user?.name ?? "?"}
          src={user?.avatar}
          size="lg"
          className="mx-auto"
        />
        <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          {user?.name ?? "Invitado"}
        </h1>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>
      </div>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-foreground">
        Tu actividad
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {CARDS.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="rounded-2xl bg-white p-4 shadow-lg shadow-lilac-200/50"
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />

            {stats.isPending ? (
              <Skeleton className="mt-2 h-8 w-12" />
            ) : stats.isError ? (
              <p className="mt-2 text-3xl font-bold tabular-nums text-muted">
                —
              </p>
            ) : (
              <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                {stats.data[key]}
              </p>
            )}

            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      {stats.isError ? (
        <p className="mt-3 text-center text-sm text-muted">
          No pudimos cargar tu actividad.
        </p>
      ) : null}

      <Button variant="secondary" className="mt-8 w-full" onClick={logout}>
        Cerrar sesión
      </Button>
    </section>
  );
}
