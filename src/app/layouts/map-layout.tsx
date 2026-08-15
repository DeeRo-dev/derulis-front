import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/layout/bottom-nav";

/**
 * Para pantallas donde el mapa ocupa todo: sin cabecera ni padding, porque
 * los controles flotan encima del mapa.
 */
export function MapLayout() {
  return (
    <div className="h-svh overflow-hidden bg-lilac-50">
      <Outlet />
      <BottomNav />
    </div>
  );
}
