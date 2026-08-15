import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { DEFAULT_CENTER } from "@/lib/map";
import type { MapPoint } from "@/lib/map";

/* El icono por defecto de Leaflet apunta a imágenes por ruta relativa que
   el bundler no resuelve, y los pines salen invisibles. Van SVG propios. */

const FORK = `<path d="M9 3v6M12 3v6M10.5 9v12M15.5 3c-1.5 1.5-1.5 5 0 6.5V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`;

/** Pin chico y neutro: los lugares que no están seleccionados. */
const dotIcon = L.divIcon({
  className: "",
  html: `<span style="display:flex;width:28px;height:28px;align-items:center;justify-content:center;border-radius:9999px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);color:#7A7385">
    <svg width="15" height="15" viewBox="0 0 24 24">${FORK}</svg>
  </span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/** Pin seleccionado: gota violeta con el nombre encima, como el diseño. */
const selectedIcon = (name: string) =>
  L.divIcon({
    className: "",
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
      <span style="white-space:nowrap;border-radius:9999px;background:#7343E0;color:#fff;padding:6px 14px;font:600 13px system-ui;box-shadow:0 4px 12px rgba(115,67,224,.4)">${name}</span>
      <span style="margin-top:6px;display:flex;width:38px;height:38px;align-items:center;justify-content:center;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#7343E0;box-shadow:0 4px 12px rgba(115,67,224,.45)">
        <svg width="18" height="18" viewBox="0 0 24 24" style="transform:rotate(45deg);color:#fff">${FORK}</svg>
      </span>
    </div>`,
    iconSize: [140, 76],
    iconAnchor: [70, 76],
  });

/** Reencuadra cuando cambian los puntos (otra búsqueda, otro filtro). */
function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(
      L.latLngBounds(points.map((p) => [p.latitude, p.longitude])),
      { padding: [60, 60], maxZoom: 15 },
    );
  }, [map, points]);

  return null;
}

/** Centra en el punto elegido sin cambiar el zoom. */
function PanTo({ point }: { point: MapPoint | null }) {
  const map = useMap();

  useEffect(() => {
    if (point) map.panTo([point.latitude, point.longitude]);
  }, [map, point]);

  return null;
}

export function PlaceMap({
  points,
  selectedId,
  onSelect,
  className,
}: {
  points: MapPoint[];
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  className?: string;
}) {
  const selected = points.find((point) => point.id === selectedId) ?? null;

  return (
    /* `z-0` crea un contexto de apilamiento: sin él, los paneles internos
       de Leaflet (z-index 400-700) compiten con el resto de la página y
       tapan la navegación inferior. */
    <div className={cn("relative isolate z-0", className)}>
      <MapContainer
        center={
          points.length > 0
            ? [points[0].latitude, points[0].longitude]
            : DEFAULT_CENTER
        }
        zoom={13}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={points} />
        <PanTo point={selected} />

        {points.map((point) => {
          const isSelected = point.id === selectedId;
          return (
            <Marker
              key={point.id}
              position={[point.latitude, point.longitude]}
              icon={isSelected ? selectedIcon(point.name) : dotIcon}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={
                onSelect ? { click: () => onSelect(point.id) } : undefined
              }
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
