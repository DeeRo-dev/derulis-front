import { Link, useLocation } from "react-router-dom";
import { FiCompass, FiHeart, FiLogOut, FiSearch, FiX } from "react-icons/fi";
import { PiChatCenteredDotsBold, PiUsersThreeFill } from "react-icons/pi";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";
import { useCurrentUser, useLogout } from "@/features/auth/hooks/use-auth";

const ITEMS = [
  { to: "/discover", label: "Descubrir", Icon: FiCompass },
  { to: "/search", label: "Buscar", Icon: FiSearch },
  { to: "/tables", label: "Mis Mesas", Icon: PiUsersThreeFill },
  { to: "/reviews", label: "Mis Reseñas", Icon: PiChatCenteredDotsBold },
  { to: "/favorites", label: "Favoritos", Icon: FiHeart },
] as const;

/** El @usuario sale del email porque la cuenta no guarda un alias propio. */
function handleFor(email: string) {
  return `@${email.split("@")[0]}`;
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const user = useCurrentUser();
  const logout = useLogout();

  /* En celular el sidebar es un panel encima del contenido: si no se cierra
     al navegar, tapa la pantalla a la que acabás de entrar. */
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const isActive = (to: string) =>
    pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Sidebar side="right">
      <SidebarHeader className="gap-0 bg-lilac-100 p-0">
        <div className="flex items-start justify-between gap-3 px-4 py-5">
          {/* La X va del lado por el que entra el panel, para que quede
              debajo del mismo pulgar que abrió el menú. */}
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              aria-label="Cerrar menú"
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-white/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}

          <Link
            to="/profile"
            onClick={closeOnMobile}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Avatar
              name={user?.name ?? "Comensal"}
              src={user?.avatar}
              size="lg"
              className="ring-2 ring-white"
            />
            <span className="min-w-0">
              <span className="block truncate font-bold text-foreground">
                {user?.name ?? "Comensal"}
              </span>
              {user ? (
                <span className="block truncate text-sm text-muted">
                  {handleFor(user.email)}
                </span>
              ) : null}
            </span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-3">
          <SidebarMenu className="gap-1">
            {ITEMS.map(({ to, label, Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(to)}
                  size="lg"
                  className="gap-3 rounded-xl px-3 font-semibold data-[active=true]:font-bold"
                >
                  <Link to={to} onClick={closeOnMobile}>
                    <Icon
                      className="h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mx-0 mb-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={logout}
              className="gap-3 rounded-xl px-3 font-semibold"
            >
              <FiLogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
