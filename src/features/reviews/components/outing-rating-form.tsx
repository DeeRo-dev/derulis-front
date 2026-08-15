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
}: {
  onSave: (input: {
    placeDerulis: number;
    serviceDerulis: number;
    comment?: string;
  }) => void;
  isSaving: boolean;
  saved: boolean;
}) {
  const [place, setPlace] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const complete = place !== null && service !== null;

  return (
    <section className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50">
      <h2 className="text-lg font-bold tracking-tight text-foreground">
        El lugar y la atención
      </h2>
      <p className="mt-1 text-sm text-muted">
        Van aparte de las comidas y pesan igual en tu voto.
      </p>

      <div className="mt-4 space-y-4">
        <DerulisPicker
          label="El lugar"
          value={place}
          onChange={setPlace}
          name="place-derulis"
        />
        <DerulisPicker
          label="La atención"
          value={service}
          onChange={setService}
          name="service-derulis"
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
        onClick={() =>
          complete &&
          onSave({
            placeDerulis: place,
            serviceDerulis: service,
            comment: comment.trim() || undefined,
          })
        }
      >
        {isSaving ? "Guardando…" : saved ? "Actualizar" : "Guardar"}
      </Button>
    </section>
  );
}
