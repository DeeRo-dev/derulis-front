import { useState } from "react";
import { FiKey } from "react-icons/fi";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { FormError } from "@/features/auth/components/form-error";
import { getApiErrorMessage, isNotFound } from "@/lib/apiClient";
import { useJoinTable } from "../hooks/use-tables";

/** El código se dicta o se pega: aceptamos minúsculas, espacios y guiones. */
function normalize(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

export function JoinTablePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const join = useJoinTable();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (code.length < 6) {
      setError("El código tiene 8 caracteres");
      return;
    }

    setError(undefined);
    join.mutate(code);
  };

  return (
    <section>
      <DetailTopBar />

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        Unirte a una mesa
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Pedile el código a quien la armó. Lo encuentra en el detalle de la
        mesa.
      </p>

      <form className="mt-6 space-y-5" onSubmit={submit} noValidate>
        {join.isError ? (
          <FormError
            message={
              isNotFound(join.error)
                ? "Ese código no corresponde a ninguna mesa."
                : getApiErrorMessage(
                    join.error,
                    "No pudimos sumarte. Probá de nuevo.",
                  )
            }
          />
        ) : null}

        <TextField
          label="Código de invitación"
          placeholder="ABCD2345"
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="font-mono text-lg tracking-[0.2em]"
          value={code}
          error={error}
          onChange={(e) => setCode(normalize(e.target.value))}
        />

        <Button type="submit" className="w-full" disabled={join.isPending}>
          <FiKey className="h-5 w-5" aria-hidden="true" />
          {join.isPending ? "Sumándote…" : "Unirme a la mesa"}
        </Button>
      </form>
    </section>
  );
}
