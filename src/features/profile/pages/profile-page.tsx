import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";

export function ProfilePage() {
  const user = useCurrentUser();
  const logout = useLogout();

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

      <Button variant="secondary" className="mt-6 w-full" onClick={logout}>
        Cerrar sesión
      </Button>
    </section>
  );
}
