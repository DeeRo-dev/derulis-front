import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";

/** Los montos viajan en centavos: acá se convierte lo que escribe el usuario. */
function toCents(input: string): number | undefined {
  const clean = input.replace(/\./g, "").replace(",", ".").trim();
  if (!clean) return undefined;
  const value = Number(clean);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return Math.round(value * 100);
}

export function AddMealForm({
  onAdd,
  isSaving,
}: {
  onAdd: (input: { name: string; price?: number }) => void;
  isSaving: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string>();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    setError(undefined);
    onAdd({ name: name.trim(), price: toCents(price) });
    setName("");
    setPrice("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <FiPlus className="h-5 w-5" aria-hidden="true" />
        Agregar una comida
      </Button>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl bg-white p-5 shadow-lg shadow-lilac-200/50"
    >
      <h3 className="text-lg font-bold tracking-tight text-foreground">
        Nueva comida
      </h3>
      <p className="mt-1 text-sm text-muted">
        Cargala una vez: después la puntúan todos los comensales.
      </p>

      <div className="mt-4 space-y-4">
        <TextField
          label="Nombre"
          placeholder="Pasta carbonara"
          maxLength={120}
          autoFocus
          value={name}
          error={error}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Precio"
          placeholder="3200"
          inputMode="decimal"
          hint="Opcional"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            setOpen(false);
            setError(undefined);
          }}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isSaving}>
          {isSaving ? "Agregando…" : "Agregar"}
        </Button>
      </div>
    </form>
  );
}
