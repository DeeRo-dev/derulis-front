import { useMemo, useState } from "react";
import { FiSearch, FiCrosshair, FiX, FiList } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { PlaceMap } from "@/components/ui/place-map";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { MapPoint } from "@/lib/map";
import { distanceKm } from "@/lib/geo";
import { usePlace, usePlaces } from "@/features/places/hooks/use-places";
import { cn } from "@/lib/utils";
import { MapPlaceCard } from "../components/map-place-card";

/** Tope del backend (SearchPlacesDto): pedir más devuelve 400. */
const MAP_LIMIT = 50;

type Filter = "top" | "near" | null;

export function SearchPage() {
  const [params] = useSearchParams();

  /* Se llega acá desde la dirección de un lugar: `/search?place=12`. */
  const [pinnedId] = useState<number | null>(() => {
    const raw = Number(params.get("place"));
    return Number.isInteger(raw) && raw > 0 ? raw : null;
  });

  /* El foco es solo la cámara y dura hasta que el usuario hace algo: busca,
     filtra o toca otro pin. El pin en sí (`pinnedId`) se queda: si se fuera
     del mapa al tocar otro lugar, el que vino a ver desaparecería. */
  const [focusId, setFocusId] = useState<number | null>(pinnedId);

  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>(null);
  const [selectedId, setSelectedId] = useState<number | null>(pinnedId);
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState<string>();

  const query = usePlaces({
    search: search || undefined,
    sort: filter === "top" ? "top" : "name",
    page: 1,
    limit: MAP_LIMIT,
  });

  /* El listado trae 50 lugares como mucho: el que vino por la URL puede no
     estar entre ellos. Se pide aparte para que el pin exista siempre. */
  const pinnedPlace = usePlace(pinnedId ?? Number.NaN);

  /* Solo los que tienen punto cargado pueden ir al mapa. */
  const located = useMemo(() => {
    const items = [...(query.data?.items ?? [])];

    const pinned = pinnedPlace.data;
    if (pinned && !items.some((place) => place.id === pinned.id)) {
      items.push(pinned);
    }

    return items.filter(
      (place): place is typeof place & { latitude: number; longitude: number } =>
        place.latitude !== null && place.longitude !== null,
    );
  }, [query.data, pinnedPlace.data]);

  const ordered = useMemo(() => {
    if (filter !== "near" || !me) return located;
    return [...located].sort(
      (a, b) =>
        distanceKm(me, { lat: a.latitude, lng: a.longitude }) -
        distanceKm(me, { lat: b.latitude, lng: b.longitude }),
    );
  }, [located, filter, me]);

  const points: MapPoint[] = ordered.map((place) => ({
    id: place.id,
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
  }));

  const selected = ordered.find((place) => place.id === selectedId) ?? null;

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no permite ubicarte");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoError(undefined);
        setMe({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      // Denegar el permiso es una decisión del usuario, no un error a gritar.
      () => setGeoError("No pudimos acceder a tu ubicación"),
    );
  };

  return (
    <div className="relative h-svh w-full">
      <PlaceMap
        points={points}
        selectedId={selectedId}
        focusId={focusId}
        onSelect={(id) => {
          setFocusId(null);
          setSelectedId(id);
        }}
        className="absolute inset-0"
      />

      {/* Buscador flotante */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4">
        <div className="flex items-center gap-2">
        <form
          role="search"
          className="pointer-events-auto flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white p-2 pl-4 shadow-xl shadow-lilac-900/10"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(draft.trim());
            setSelectedId(null);
            setFocusId(null);
          }}
        >
          <FiSearch className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <label htmlFor="map-search" className="sr-only">
            Buscar restaurantes
          </label>
          <input
            id="map-search"
            type="search"
            placeholder="Buscar restaurantes, mesas…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-foreground outline-none placeholder:text-muted"
          />
          {search ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => {
                setDraft("");
                setSearch("");
                setFocusId(null);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-lilac-100"
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
          <Link
            to="/discover"
            aria-label="Ver como lista"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lilac-100 text-lilac-700 transition hover:bg-lilac-200"
          >
            <FiList className="h-5 w-5" aria-hidden="true" />
          </Link>
        </form>

        {/* Esta pantalla no tiene cabecera, así que sin este botón el mapa
            sería un callejón sin salida. Va a la derecha, igual que en el
            resto de la app. */}
        <SidebarTrigger className="pointer-events-auto h-12 w-12 shrink-0 rounded-full bg-white shadow-xl shadow-lilac-900/10 hover:bg-lilac-50" />
        </div>

        {/* Filtros */}
        <div className="pointer-events-auto -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {(
            [
              { key: "top", label: "Mejor valorados" },
              { key: "near", label: "Cerca mío" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => {
                const next = filter === key ? null : key;
                setFilter(next);
                setFocusId(null);
                if (next === "near" && !me) locate();
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium shadow-md transition",
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-foreground hover:bg-lilac-50",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {geoError ? (
          <p
            role="alert"
            className="pointer-events-auto mt-2 rounded-xl bg-white px-3 py-2 text-sm text-error shadow-md"
          >
            {geoError}
          </p>
        ) : null}
      </div>

      {/* Ubicarme */}
      <button
        type="button"
        onClick={locate}
        aria-label="Centrar en mi ubicación"
        className={cn(
          "absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl transition hover:bg-lilac-50",
          // Ya no hay nav abajo: los controles bajan hasta el borde.
          selected ? "bottom-36" : "bottom-6",
        )}
      >
        <FiCrosshair className="h-5 w-5 text-lilac-700" aria-hidden="true" />
      </button>

      {/* Tarjeta del lugar elegido */}
      <div className="absolute inset-x-0 bottom-6 z-10 px-4">
        {selected ? (
          <MapPlaceCard
            place={selected}
            distanceKm={
              me
                ? distanceKm(me, {
                    lat: selected.latitude,
                    lng: selected.longitude,
                  })
                : null
            }
          />
        ) : (
          <p className="rounded-2xl bg-white/95 px-4 py-3 text-center text-sm text-muted shadow-lg backdrop-blur">
            {query.isPending
              ? "Cargando lugares…"
              : query.isError
                ? "No pudimos cargar los lugares."
                : points.length === 0
                  ? "Ningún lugar tiene su punto marcado todavía."
                  : `${points.length} ${points.length === 1 ? "lugar" : "lugares"} en el mapa · tocá un pin`}
          </p>
        )}
      </div>
    </div>
  );
}
