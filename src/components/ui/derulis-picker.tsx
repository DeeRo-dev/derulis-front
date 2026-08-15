import { useId } from "react";
import { PiForkKnifeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

const VALUES = [1, 2, 3, 4, 5];

/**
 * Selector de 1 a 5 derulis. Usa radios reales, ocultos visualmente: así
 * funciona con teclado y lo anuncia bien un lector de pantalla, cosa que
 * una fila de <button> no da gratis.
 */
export function DerulisPicker({
  label,
  value,
  onChange,
  name,
  size = "md",
}: {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  name?: string;
  size?: "md" | "lg";
}) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const iconSize = size === "lg" ? "h-8 w-8" : "h-6 w-6";

  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-medium text-foreground">{label}</legend>

      <div className="mt-2 flex items-center gap-1">
        {VALUES.map((option) => {
          const selected = value !== null && option <= value;
          return (
            <label
              key={option}
              className="cursor-pointer rounded-lg p-1 transition hover:bg-lilac-100 focus-within:ring-2 focus-within:ring-primary"
            >
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <PiForkKnifeFill
                aria-hidden="true"
                className={cn(
                  iconSize,
                  "transition-colors",
                  selected ? "text-derulis" : "text-derulis-empty",
                )}
              />
              <span className="sr-only">
                {option} {option === 1 ? "derulis" : "derulis"}
              </span>
            </label>
          );
        })}

        <span className="ml-2 text-sm font-semibold tabular-nums text-muted">
          {value === null ? "Sin puntuar" : `${value}/5`}
        </span>
      </div>
    </fieldset>
  );
}
