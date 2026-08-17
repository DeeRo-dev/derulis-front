import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * Envuelve todas las pantallas con sesión iniciada. El sidebar vive acá y no
 * en cada layout para que no se desmonte al navegar: si se remontara, en
 * escritorio parpadearía y en celular se perdería la animación de cierre.
 *
 * En celular (<768px) el Sidebar se dibuja solo como panel encima del
 * contenido; en escritorio queda fijo a la izquierda.
 */
export function AppShell() {
  return (
    /* El orden importa: el sidebar va abierto a la derecha, así que en
       escritorio tiene que ir después del contenido para que el hueco que
       reserva quede del lado correcto. */
    <SidebarProvider>
      <SidebarInset>
        <Outlet />
      </SidebarInset>
      <AppSidebar />
    </SidebarProvider>
  );
}
