import { useId, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { IMAGE_ACCEPT, validateImage } from "@/features/images/api/images.api";

/**
 * Botón para elegir una imagen del dispositivo.
 *
 * Es un `<label>` sobre un input oculto y no un `<button>` que dispare un
 * click: así el teclado y los lectores de pantalla lo anuncian como lo que
 * es —un campo de archivo— sin que haya que reimplementar nada.
 *
 * Valida acá mismo antes de avisar al padre: no tiene sentido subir 5 MB
 * para que el servidor los rechace.
 */
export function ImagePicker({
  onPick,
  label,
  disabled,
  busy,
  className,
  variant = "solid",
}: {
  onPick: (file: File) => void;
  label: string;
  disabled?: boolean;
  /** Subiendo: bloquea y muestra el estado. */
  busy?: boolean;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const blocked = disabled || busy;

  const variants = {
    solid:
      "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-lilac-200/50",
    outline:
      "border border-lilac-300 bg-white text-primary hover:bg-lilac-50",
    ghost: "bg-white/95 text-primary shadow-lg backdrop-blur hover:bg-white",
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          variants[variant],
          blocked && "pointer-events-none opacity-60",
        )}
      >
        <FiCamera className="h-4 w-4 shrink-0" aria-hidden="true" />
        {busy ? "Subiendo…" : label}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          disabled={blocked}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];

            /* El input se limpia siempre: si no, volver a elegir el mismo
               archivo no dispara `change` y parece que el botón no anda. */
            event.target.value = "";
            if (!file) return;

            const problem = validateImage(file);
            setError(problem);
            if (!problem) onPick(file);
          }}
        />
      </label>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
