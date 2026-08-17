import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiMapPin, FiCrosshair } from "react-icons/fi";
import { DEFAULT_CENTER } from "@/lib/map";

const pin = L.divIcon({
  className: "",
  html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 13.4 23.6 14 24.2a1.4 1.4 0 0 0 2 0c.6-.6 14-13.7 14-24.2C30 6.7 23.3 0 15 0z" fill="#7343E0"/>
    <circle cx="15" cy="15" r="8" fill="#fff"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

function ClickToPlace({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (event) => onPick(event.latlng.lat, event.latlng.lng),
  });
  return null;
}

/** Sigue al punto marcado: el mapa no se queda mirando otro lado. */
function Recenter({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude === null || longitude === null) return;
    map.setView([latitude, longitude], 17, { animate: false });
  }, [map, latitude, longitude]);

  return null;
}

/**
 * El usuario marca el punto tocando el mapa, o con un toque si está en el
 * lugar.
 *
 * Se elige esto en vez de geocodificar la dirección para no depender de un
 * servicio externo con límites de uso, y porque el que estuvo ahí ubica el
 * lugar mejor que un geocoder con una dirección escrita a mano.
 */
export function LocationPicker({
  latitude,
  longitude,
  onPick,
  error,
}: {
  latitude: number | null;
  longitude: number | null;
  onPick: (lat: number, lng: number) => void;
  error?: string;
}) {
  const picked = latitude !== null && longitude !== null;
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string>();

  // El error de validación del formulario manda sobre el del geolocalizador.
  const message = error ?? geoError;

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no permite ubicarte");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setGeoError(undefined);
        onPick(position.coords.latitude, position.coords.longitude);
      },
      // Negar el permiso es una decisión, no un error a gritar.
      () => {
        setLocating(false);
        setGeoError("No pudimos acceder a tu ubicación. Marcalo en el mapa.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="block text-sm font-medium text-foreground">
          Ubicación en el mapa
        </span>
        {picked ? (
          <span className="text-xs tabular-nums text-muted">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        ) : null}
      </div>

      {/* El caso más común es cargar el lugar estando ahí: un toque y listo. */}
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white text-sm font-semibold text-primary transition-colors hover:bg-lilac-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FiCrosshair className="h-4 w-4 shrink-0" aria-hidden="true" />
        {locating ? "Ubicándote…" : "Estoy acá: usar mi ubicación"}
      </button>

      <div className="overflow-hidden rounded-2xl border border-lilac-200">
        <MapContainer
          center={picked ? [latitude, longitude] : DEFAULT_CENTER}
          zoom={picked ? 16 : 12}
          scrollWheelZoom={false}
          className="h-56 w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPick={onPick} />
          <Recenter latitude={latitude} longitude={longitude} />
          {picked ? (
            <Marker position={[latitude, longitude]} icon={pin} />
          ) : null}
        </MapContainer>
      </div>

      {message ? (
        <p role="alert" className="text-sm text-error">
          {message}
        </p>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Tocá el mapa para corregir el punto.
        </p>
      )}
    </div>
  );
}
