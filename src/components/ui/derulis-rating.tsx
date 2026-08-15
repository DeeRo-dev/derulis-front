import { PiForkKnifeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

type DerulisRatingProps = {
  /** 1 a 5. */
  value: number;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * La puntuación de la app: 1 a 5 derulis.
 * El valor va también como foreground para lectores de pantalla — el color
 * por sí solo no puede ser el único canal (brief, sección 6).
 */
export function DerulisRating({
  value,
  size = "md",
  className,
}: DerulisRatingProps) {
  const rounded = Math.round(value);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <span className="sr-only">{value} de 5 derulis</span>
      {Array.from({ length: 5 }, (_, i) => (
        <PiForkKnifeFill
          key={i}
          aria-hidden="true"
          className={cn(
            SIZES[size],
            i < rounded ? "text-derulis" : "text-derulis-empty",
          )}
        />
      ))}
    </span>
  );
}
