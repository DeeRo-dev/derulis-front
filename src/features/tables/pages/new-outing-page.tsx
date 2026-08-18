import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiMapPin,
  FiLink,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiShoppingBag,
} from "react-icons/fi";
import { PiForkKnifeFill } from "react-icons/pi";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationPicker } from "@/components/ui/location-picker";
import { FormError } from "@/features/auth/components/form-error";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { usePlaces } from "@/features/places/hooks/use-places";
import { toInstagramHandle } from "@/features/places/lib/instagram";
import { useDebounced } from "@/hooks/use-debounced";
import type { PlaceWithScore } from "@/features/places/types";
import { getApiErrorMessage } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { useTable } from "../hooks/use-tables";
import { useCreateOuting } from "../hooks/use-new-outing";
import { GuestPicker } from "../components/guest-picker";

/** `datetime-local` da "2026-08-20T21:00", que ya es ISO válido. */
function nowLocalIso(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export function NewOutingPage() {
  const { tableId } = useParams();
  const id = Number(tableId);
  const currentUser = useCurrentUser();

  const table = useTable(id);
  const createOuting = useCreateOuting(id);

  const [mode, setMode] = useState<"now" | "scheduled">("now");
  const [name, setName] = useState("");
  /* Un lugar ya registrado que el usuario eligió de las sugerencias: se
     reusa su ficha en vez de cargar otra igual. */
  const [existing, setExisting] = useState<PlaceWithScore | null>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [instagram, setInstagram] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const invited = mode === "scheduled";

  /* Busca mientras se escribe el nombre para atajar el duplicado antes de
     crearlo. El backend igual lo verifica, pero enterarse después de cargar
     todo el formulario es tarde. */
  const typedName = useDebounced(name.trim());
  const searching = existing === null && typedName.length >= 3;

  const suggestions = usePlaces(
    { search: typedName, sort: "name", page: 1, limit: 3 },
    { enabled: searching },
  );
  const matches = searching ? (suggestions.data?.items ?? []) : [];

  // El creador va siempre: no se elige a sí mismo.
  const members = (table.data?.members ?? []).filter(
    (member) => member.id !== currentUser?.id,
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const when = invited ? dateTime : nowLocalIso();
    const dateError = invited && !dateTime ? "Elegí la fecha y la hora" : undefined;

    /* Con un lugar ya elegido no hay ficha que validar: solo la fecha. */
    if (existing) {
      setErrors({ dateTime: dateError });
      if (dateError) return;

      createOuting.mutate({
        place: { existingId: existing.id },
        dateTime: when,
        guestIds: selected,
        attendance: invited ? "invited" : "confirmed",
      });
      return;
    }

    const next: Record<string, string | undefined> = {
      name:
        name.trim().length < 2
          ? "El nombre debe tener al menos 2 caracteres"
          : undefined,
      address:
        address.trim().length < 3
          ? "La dirección debe tener al menos 3 caracteres"
          : undefined,
      city: city.trim().length < 2 ? "Ingresá la ciudad" : undefined,
      province: province.trim().length < 2 ? "Ingresá la provincia" : undefined,
      // Obligatoria: sin punto el lugar no aparece en el mapa.
      coords: coords ? undefined : "Marcá dónde queda para poder mapearlo",
      dateTime: dateError,
    };

    setErrors(next);
    if (Object.values(next).some(Boolean) || !coords) return;

    createOuting.mutate({
      place: {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        province: province.trim(),
        instagram: toInstagramHandle(instagram),
        latitude: coords.lat,
        longitude: coords.lng,
      },
      dateTime: when,
      guestIds: selected,
      attendance: invited ? "invited" : "confirmed",
    });
  };

  return (
    <section>
      <DetailTopBar />

      <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
        Nuevo lugar
      </h1>

      <form className="mt-6 space-y-6" onSubmit={submit} noValidate>
        {createOuting.isError ? (
          <FormError
            message={getApiErrorMessage(
              createOuting.error,
              "No pudimos registrar el lugar. Probá de nuevo.",
            )}
          />
        ) : null}

        {existing ? (
          /* Lugar ya registrado: no se piden sus datos de nuevo. */
          <div className="flex items-start gap-3 rounded-2xl bg-lilac-100 p-4">
            <FiCheckCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">
                {existing.name}
              </p>
              <p className="truncate text-sm text-muted">{existing.address}</p>
              <button
                type="button"
                onClick={() => setExisting(null)}
                className="mt-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cargar otro lugar
              </button>
            </div>
          </div>
        ) : null}

        <div className={cn("space-y-4", existing && "hidden")}>
          <div>
            <TextField
              label="Nombre del restaurante"
              placeholder="Osteria Bianca"
              maxLength={120}
              autoFocus
              icon={<FiShoppingBag className="h-5 w-5" />}
              value={name}
              error={errors.name}
              onChange={(e) => setName(e.target.value)}
            />

            {matches.length > 0 ? (
              <div className="mt-2 rounded-2xl border border-lilac-200 bg-white p-2">
                <p className="px-2 py-1 text-xs font-semibold text-muted">
                  Ya está registrado, ¿es alguno de estos?
                </p>
                <ul>
                  {matches.map((place) => (
                    <li key={place.id}>
                      <button
                        type="button"
                        onClick={() => setExisting(place)}
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {place.name}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {place.address}
                          </span>
                        </span>
                        <FiCheck
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <TextField
            label="Dirección"
            placeholder="Av. Culinaria 124, Centro"
            maxLength={200}
            icon={<FiMapPin className="h-5 w-5" />}
            value={address}
            error={errors.address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Ciudad y provincia habilitan los filtros por zona. */}
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Ciudad"
              placeholder="Buenos Aires"
              maxLength={120}
              value={city}
              error={errors.city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              label="Provincia"
              placeholder="CABA"
              maxLength={120}
              value={province}
              error={errors.province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>

          <TextField
            label="Instagram"
            placeholder="@osteriabianca"
            hint="Opcional. Podés pegar el link completo."
            icon={<FiLink className="h-5 w-5" />}
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />

          <LocationPicker
            latitude={coords?.lat ?? null}
            longitude={coords?.lng ?? null}
            onPick={(lat, lng) => setCoords({ lat, lng })}
            error={errors.coords}
          />
        </div>

        {/* Fuera del bloque de arriba: la fecha se pide igual, se cargue un
            lugar nuevo o se elija uno ya registrado. */}
        {invited ? (
          <TextField
            label="Fecha y hora"
            type="datetime-local"
            icon={<FiCalendar className="h-5 w-5" />}
            value={dateTime}
            error={errors.dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        ) : null}

        <fieldset>
          <legend className="text-sm font-semibold text-foreground">
            Estado
          </legend>

          <div className="mt-2 grid grid-cols-2 gap-3">
            {(
              [
                { key: "now", label: "Estamos visitándolo", Icon: PiForkKnifeFill },
                { key: "scheduled", label: "Próxima cita", Icon: FiCalendar },
              ] as const
            ).map(({ key, label, Icon }) => (
              <label
                key={key}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-center text-sm font-semibold transition",
                  "focus-within:ring-2 focus-within:ring-primary",
                  mode === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-lilac-200/60 text-muted hover:bg-lilac-200",
                )}
              >
                <input
                  type="radio"
                  name="mode"
                  checked={mode === key}
                  onChange={() => setMode(key)}
                  className="sr-only"
                />
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {table.isPending ? (
          <Skeleton className="h-52 rounded-3xl" />
        ) : members.length > 0 ? (
          <GuestPicker
            tableName={table.data?.name ?? "Mesa"}
            members={members}
            selected={selected}
            invited={invited}
            onToggle={(memberId) =>
              setSelected((current) =>
                current.includes(memberId)
                  ? current.filter((value) => value !== memberId)
                  : [...current, memberId],
              )
            }
            onSelectAll={() => setSelected(members.map((m) => m.id))}
          />
        ) : (
          <p className="rounded-2xl bg-lilac-100 px-4 py-3 text-sm text-lilac-700">
            Sos el único en esta mesa. Podés registrar el lugar igual: comer
            solo también cuenta.
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={createOuting.isPending}
        >
          {createOuting.isPending
            ? "Guardando…"
            : invited
              ? "Confirmar cita"
              : "Confirmar lugar"}
          <FiCheckCircle className="h-5 w-5" aria-hidden="true" />
        </Button>
      </form>
    </section>
  );
}
