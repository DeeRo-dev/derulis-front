import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiCheck, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { AvatarStack } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormError } from "@/features/auth/components/form-error";
import { useActiveTables } from "@/features/tables/hooks/use-tables";
import { getApiErrorMessage } from "@/lib/apiClient";
import { itemVariants, listVariants, tap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useScheduleVisit } from "../hooks/use-schedule-visit";

/** `datetime-local` quiere "2026-08-20T21:00" en hora local, no UTC. */
function localIso(date: Date): string {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
}

/** Por defecto, esta noche a las 21. Es el plan más probable. */
function tonight(): string {
  const date = new Date();
  date.setHours(21, 0, 0, 0);
  if (date.getTime() < Date.now()) date.setDate(date.getDate() + 1);
  return localIso(date);
}

export function ScheduleVisitSheet({
  placeId,
  placeName,
  open,
  onOpenChange,
}: {
  placeId: number;
  placeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const tables = useActiveTables();
  const schedule = useScheduleVisit(placeId);

  const [tableId, setTableId] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState(tonight);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (tableId === null) return;
    schedule.mutate({ tableId, dateTime });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85svh] gap-0 overflow-y-auto rounded-t-3xl border-t-0 bg-white"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Agendar en {placeName}
          </SheetTitle>
          <SheetDescription>
            Elegí con qué mesa vas y cuándo. Los comensales reciben la
            invitación y confirman.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="space-y-6 p-5 pt-4">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              ¿Con qué mesa?
            </legend>

            {tables.isPending ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-16 rounded-2xl" />
                <Skeleton className="h-16 rounded-2xl" />
              </div>
            ) : tables.isError ? (
              <p className="mt-3 text-sm text-muted">
                No pudimos cargar tus mesas.
              </p>
            ) : tables.data.length === 0 ? (
              <div className="mt-3 rounded-2xl bg-lilac-50 p-5 text-center">
                <FiUsers
                  className="mx-auto h-6 w-6 text-lilac-400"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-muted">
                  Todavía no tenés mesas. Creá una para agendar acá.
                </p>
                <Link
                  to="/tables/new"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Crear una mesa
                </Link>
              </div>
            ) : (
              <motion.div
                variants={listVariants}
                initial="initial"
                animate="animate"
                className="mt-3 space-y-2"
              >
                {tables.data.map((table) => {
                  const selected = table.id === tableId;

                  return (
                    <motion.button
                      key={table.id}
                      type="button"
                      variants={itemVariants}
                      whileTap={tap}
                      aria-pressed={selected}
                      onClick={() => setTableId(table.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        selected
                          ? "border-primary bg-lilac-50"
                          : "border-lilac-200 bg-white hover:bg-lilac-50",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">
                          {table.name}
                        </p>
                        <div className="mt-1.5">
                          <AvatarStack people={table.members} />
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-lilac-300",
                        )}
                      >
                        {selected ? <FiCheck className="h-3.5 w-3.5" /> : null}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </fieldset>

          <div className="space-y-1.5">
            <label
              htmlFor="visit-date"
              className="block text-sm font-medium text-foreground"
            >
              ¿Cuándo?
            </label>
            <div className="relative">
              <FiCalendar
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="visit-date"
                type="datetime-local"
                value={dateTime}
                min={localIso(new Date())}
                onChange={(event) => setDateTime(event.target.value)}
                className="h-12 w-full rounded-xl bg-lilac-100 pl-11 pr-4 text-base text-foreground outline-none transition focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <FormError
            message={
              schedule.isError
                ? getApiErrorMessage(
                    schedule.error,
                    "No pudimos agendar la salida.",
                  )
                : null
            }
          />

          <Button
            type="submit"
            className="w-full"
            disabled={tableId === null || schedule.isPending}
          >
            {schedule.isPending ? "Agendando…" : "Agendar cita"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
