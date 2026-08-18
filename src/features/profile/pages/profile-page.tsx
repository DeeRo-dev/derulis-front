import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiUsers, FiUser, FiLock, FiChevronRight } from "react-icons/fi";
import { PiForkKnifeFill, PiNotePencilFill } from "react-icons/pi";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/ui/image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";
import {
  useDeleteAvatar,
  useUploadAvatar,
} from "@/features/images/hooks/use-images";
import { EditNameSheet } from "../components/edit-name-sheet";
import { ChangePasswordSheet } from "../components/change-password-sheet";
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

/** Una fila de la lista de ajustes. */
function SettingRow({
  icon,
  label,
  detail,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lilac-100 text-lilac-700"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-foreground">{label}</span>
        <span className="block truncate text-sm text-muted">{detail}</span>
      </span>
      <FiChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
    </button>
  );
}

export function ProfilePage() {
  const user = useCurrentUser();
  const [editingName, setEditingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const logout = useLogout();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useDeleteAvatar();

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
          size="xl"
          className="mx-auto"
        />
        <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          {user?.name ?? "Invitado"}
        </h1>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>

        <div className="mt-5 flex flex-col items-center gap-2">
          <ImagePicker
            variant="outline"
            label={user?.avatar ? "Cambiar foto" : "Subir foto"}
            busy={uploadAvatar.isPending}
            // Marco redondo: el avatar se muestra así en toda la app.
            crop={{ aspect: 1, round: true }}
            onPick={(file) => uploadAvatar.mutate(file)}
          />

          {user?.avatar ? (
            <button
              type="button"
              onClick={() => removeAvatar.mutate()}
              disabled={removeAvatar.isPending}
              className="text-sm font-semibold text-muted transition-colors hover:text-error disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {removeAvatar.isPending ? "Quitando…" : "Quitar foto"}
            </button>
          ) : null}
        </div>

        {/* Los errores los avisa el toast global. */}
      </div>

      <h2 className="mt-8 text-lg font-bold tracking-tight text-foreground">
        Tu cuenta
      </h2>

      {/* `divide-y` en vez de tarjetas sueltas: son dos ajustes del mismo
          tipo y una lista se lee más rápido que dos bloques. */}
      <div className="mt-3 divide-y divide-lilac-100 overflow-hidden rounded-3xl bg-white shadow-lg shadow-lilac-200/50">
        <SettingRow
          icon={<FiUser className="h-4 w-4" />}
          label="Nombre"
          detail={user?.name ?? "Sin nombre"}
          onClick={() => setEditingName(true)}
        />
        <SettingRow
          icon={<FiLock className="h-4 w-4" />}
          label="Contraseña"
          detail="Cambiala cuando quieras"
          onClick={() => setChangingPassword(true)}
        />
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

      <EditNameSheet
        currentName={user?.name ?? ""}
        open={editingName}
        onOpenChange={setEditingName}
      />
      <ChangePasswordSheet
        open={changingPassword}
        onOpenChange={setChangingPassword}
      />
    </section>
  );
}
