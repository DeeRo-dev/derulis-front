import { Outlet } from "react-router-dom";

/**
 * Para pantallas donde el mapa ocupa todo: sin cabecera ni padding, porque
 * los controles flotan encima del mapa. El botón de menú lo pone la propia
 * pantalla, para que quede dentro de la barra flotante.
 */
export function MapLayout() {
  return (
    <div className="h-svh overflow-hidden bg-lilac-50">
      <Outlet />
    </div>
  );
}
