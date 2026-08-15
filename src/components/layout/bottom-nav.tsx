import { NavLink } from "react-router-dom";
import { FiCompass, FiSearch, FiUser } from "react-icons/fi";
import { PiUsersThreeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/discover", label: "Descubrir", Icon: FiCompass },
  { to: "/search", label: "Buscar", Icon: FiSearch },
] as const;

const TRAILING = [{ to: "/profile", label: "Perfil", Icon: FiUser }] as const;

function NavItem({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isActive ? "text-primary" : "text-muted hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-5 w-5" />
          <span>{label}</span>
          <span className="sr-only">{isActive ? "(sección actual)" : ""}</span>
        </>
      )}
    </NavLink>
  );
}

export function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-lilac-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-md items-center gap-1 px-3 pb-[env(safe-area-inset-bottom)] pt-2">
        {ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* Mesas es la acción central del producto, por eso va elevada. */}
        <NavLink
          to="/tables"
          className={({ isActive }) =>
            cn(
              "flex min-h-11 flex-1 flex-col items-center gap-1 rounded-xl text-[11px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive ? "text-primary" : "text-muted hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "-mt-5 flex h-12 w-12 items-center justify-center rounded-full shadow-lg shadow-lilac-300/60 transition-colors",
                  isActive
                    ? "bg-primary-hover text-white"
                    : "bg-primary text-white",
                )}
              >
                <PiUsersThreeFill className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="-mt-1">Mesas</span>
            </>
          )}
        </NavLink>

        {TRAILING.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}
