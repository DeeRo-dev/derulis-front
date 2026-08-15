import { useState } from "react";
import { DerulisPicker } from "@/components/ui/derulis-picker";
import { TextArea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";

const COMMENT_MAX = 1000;

/** El lugar y la atención se puntúan una vez por comensal por salida. */
export function OutingRatingForm({
  onSave,
  isSaving,
  saved,
  place,
  service,
  value,
  onPlace,
  onService,
  onValue,
}: {
  onSave: (comment?: string) => void;
  isSaving: boolean;
  saved: boolean;
  place: number | null;
  service: number | null;
  value: number | null;
  onPlace: (value: number) => void;
  onService: (value: number) => void;
  onValue: (value: number) => void;
}) {
  const [comment, setComment] = useState("");

  const complete = place !== null && service !== null && value !== null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        Calificación global
      </h2>
      <p className="mt-1 text-sm text-muted">
        Van aparte de las comidas y cada una pesa igual en tu voto.
      </p>

      <div className="mt-4 space-y-4">
        <DerulisPicker
          label="El lugar"
          value={place}
          onChange={onPlace}
          name="place-derulis"
        />
        <DerulisPicker
          label="Atención al cliente"
          value={service}
          onChange={onService}
          name="service-derulis"
        />
        <DerulisPicker
          label="Relación precio-calidad"
          value={value}
          onChange={onValue}
          name="value-derulis"
        />

        <TextArea
          label="Comentario general"
          placeholder="Algo que quieras decir de la visita en general."
          maxLength={COMMENT_MAX}
          count={comment.length}
          hint="Opcional"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!complete || isSaving}
        onClick={() => complete && onSave(comment.trim() || undefined)}
      >
        {isSaving ? "Guardando…" : saved ? "Actualizar" : "Guardar"}
      </Button>
    </section>
  );
}
