import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { FormError } from "@/features/auth/components/form-error";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { getApiErrorMessage, isNotFound } from "@/lib/apiClient";
import { formatDateTime } from "@/lib/format";
import {
  useCloseOuting,
  useCreateMeal,
  useMeals,
  useOuting,
  useRateMeal,
  useRateOuting,
  useOutingAttendance,
} from "../hooks/use-reviews";
import { MealCard } from "../components/meal-card";
import { AddMealForm } from "../components/add-meal-form";
import { OutingRatingForm } from "../components/outing-rating-form";
import { ReviewSummary } from "../components/review-summary";

export function ReviewOutingPage() {
  const navigate = useNavigate();
  const { outingId } = useParams();
  const id = Number(outingId);

  const currentUser = useCurrentUser();
  // Estado elevado: el resumen en vivo necesita ver las tres notas.
  const [place, setPlace] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const outing = useOuting(id);
  const attendance = useOutingAttendance(id);
  const meals = useMeals(id);

  const placeId = outing.data?.place.id;
  const createMeal = useCreateMeal(id);
  const rateMeal = useRateMeal(id, placeId);
  const rateOuting = useRateOuting(id, placeId);
  const closeOuting = useCloseOuting(id, placeId);

  if (outing.isPending) {
    return (
      <section>
        <DetailTopBar />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="mt-6 h-56 rounded-3xl" />
        </div>
      </section>
    );
  }

  if (outing.isError) {
    return (
      <section>
        <DetailTopBar />
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isNotFound(outing.error)
              ? "Salida no encontrada"
              : "No pudimos cargarla"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isNotFound(outing.error)
              ? "Puede que el enlace esté mal o que no seas parte de esa mesa."
              : "Revisá tu conexión y volvé a intentar."}
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate("/discover")}
          >
            Ir a Descubrir
          </Button>
        </div>
      </section>
    );
  }

  const data = outing.data;
  const closed = data.status !== "planned";

  /* Ser miembro de la mesa no alcanza: solo puntúa quien fue a la salida.
     El backend responde 403 si no sos guest, así que la UI tiene que
     ofrecer sumarse antes que los controles de puntuación. */
  const isGuest = data.guests.some((guest) => guest.id === currentUser?.id);

  if (!isGuest) {
    return (
      <section>
        <DetailTopBar />

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          {data.place.name}
        </h1>
        <p className="mt-1 text-sm text-muted first-letter:uppercase">
          {formatDateTime(data.dateTime)}
        </p>

        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
          <FiUsers
            className="mx-auto h-8 w-8 text-lilac-400"
            aria-hidden="true"
          />
          <p className="mt-3 font-semibold text-foreground">
            No estás anotado en esta salida
          </p>
          <p className="mt-1 text-sm text-muted">
            {closed
              ? "Ya ocurrió, así que no podés sumarte ni puntuarla."
              : "Sumate para cargar lo que comieron y puntuar."}
          </p>

          {attendance.join.isError ? (
            <div className="mt-4 text-left">
              <FormError
                message={getApiErrorMessage(
                  attendance.join.error,
                  "No pudimos sumarte a la salida.",
                )}
              />
            </div>
          ) : null}

          {!closed ? (
            <Button
              className="mt-5 w-full"
              disabled={attendance.join.isPending}
              onClick={() => attendance.join.mutate()}
            >
              {attendance.join.isPending ? "Sumándote…" : "Sumarme a la salida"}
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => navigate(`/places/${data.place.id}`)}
            >
              Ver el lugar
            </Button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
      <DetailTopBar />

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {data.place.name}
      </h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {data.place.address}
      </p>
      <p className="mt-1 text-sm text-muted first-letter:uppercase">
        {formatDateTime(data.dateTime)}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <FiUsers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {data.tableName} · {data.guests.length}{" "}
        {data.guests.length === 1 ? "comensal" : "comensales"}
      </p>

      {closed ? (
        <p className="mt-4 rounded-2xl bg-lilac-100 px-4 py-3 text-sm text-lilac-700">
          Esta salida ya está cerrada. Podés seguir viendo lo puntuado desde el
          lugar.
        </p>
      ) : null}

      <h2 className="mt-8 text-lg font-bold tracking-tight text-foreground">
        Lo que comieron
      </h2>
      <p className="mt-1 text-sm text-muted">
        Puntuá solo lo que probaste. Dejar algo sin puntuar no cuenta como cero.
      </p>

      <div className="mt-4 space-y-4">
        {rateMeal.isError ? (
          <FormError
            message={getApiErrorMessage(
              rateMeal.error,
              "No pudimos guardar tu puntuación.",
            )}
          />
        ) : null}

        {meals.isPending ? (
          <>
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
          </>
        ) : meals.isError ? (
          <p className="text-sm text-error">No pudimos cargar las comidas.</p>
        ) : meals.data.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-center text-sm text-muted shadow-lg shadow-lilac-200/50">
            Todavía no cargaron ninguna comida.
          </p>
        ) : (
          meals.data.map((meal) => (
            <MealCard
              key={`${meal.id}:${meal.myDerulis}:${meal.myComment ?? ""}`}
              meal={meal}
              isSaving={rateMeal.isPending}
              onSave={(input) => rateMeal.mutate({ mealId: meal.id, ...input })}
            />
          ))
        )}

        {createMeal.isError ? (
          <FormError
            message={getApiErrorMessage(
              createMeal.error,
              "No pudimos agregar la comida.",
            )}
          />
        ) : null}

        {!closed ? (
          <AddMealForm
            isSaving={createMeal.isPending}
            onAdd={(input) => createMeal.mutate(input)}
          />
        ) : null}
      </div>

      <div className="mt-8">
        {rateOuting.isError ? (
          <div className="mb-4">
            <FormError
              message={getApiErrorMessage(
                rateOuting.error,
                "No pudimos guardar tu puntuación.",
              )}
            />
          </div>
        ) : null}

        <OutingRatingForm
          isSaving={rateOuting.isPending}
          saved={rateOuting.isSuccess}
          place={place}
          service={service}
          value={value}
          onPlace={setPlace}
          onService={setService}
          onValue={setValue}
          onSave={(comment) =>
            place !== null &&
            service !== null &&
            value !== null &&
            rateOuting.mutate({
              placeDerulis: place,
              serviceDerulis: service,
              valueDerulis: value,
              comment,
            })
          }
        />
      </div>

      <div className="mt-8">
        <ReviewSummary
          meals={meals.data ?? []}
          place={place}
          service={service}
          value={value}
        />
      </div>

      {!closed ? (
        <div className="mt-8">
          <Button
            variant="secondary"
            className="w-full"
            disabled={closeOuting.isPending}
            onClick={() => closeOuting.mutate(data.totalSpend)}
          >
            {closeOuting.isPending ? "Cerrando…" : "Cerrar la salida"}
          </Button>
          {/* Ya no es "al cerrarla entra en el promedio": la salida cuenta
              desde el día siguiente a su fecha. Cerrar es solo dar por
              terminada la carga. */}
          <p className="mt-2 text-center text-xs text-muted">
            Ya cuenta en el promedio del lugar. Cerrala cuando no vayan a
            cargar nada más.
          </p>
        </div>
      ) : null}
    </section>
  );
}
