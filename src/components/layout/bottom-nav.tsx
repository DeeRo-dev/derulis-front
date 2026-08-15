import { NavLink } from "react-router-dom";
import { FiCompass, FiSearch, FiUser } from "react-icons/fi";
import { PiUsersThreeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/discover", label: "Descubrir", Icon: FiCompass },
  { to: "/search", label: "Buscar", Icon: FiSearch },
  { to: "/tables", label: "Mesas", Icon: PiUsersThreeFill },
  { to: "/profile", label: "Perfil", Icon: FiUser },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-lilac-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-md items-center gap-1 px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        {ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {({ isActive }) => (
              /* El "globo" violeta sigue a la pestaña activa: es el mismo
                 estilo aplicado a cualquiera de las cuatro, no una posición
                 fija en el medio. */
              <span
                className={cn(
                  "flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-lilac-300/60"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className={cn(isActive ? "truncate" : "sr-only")}>
                  {label}
                </span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
