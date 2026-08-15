import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/layout/bottom-nav";

/**
 * Para pantallas de detalle: sin la cabecera global, porque cada una trae
 * su propia barra con "volver" y sus acciones.
 */
export function DetailLayout() {
  return (
    <div className="min-h-svh bg-lilac-50">
      <main className="mx-auto w-full max-w-md px-5 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
