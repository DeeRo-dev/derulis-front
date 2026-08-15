import { useState } from "react";
import { PiForkKnifeBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

/**
 * Vive en `public/`, no en `src/assets/`: así se referencia por URL y, si el
 * archivo no está, la app sigue funcionando (cae al degradado de abajo).
 * Un import de `src/assets` haría fallar el build entero.
 */
const DEFAULT_PHOTO = "/default-place.jpg";

/**
 * Foto del lugar. Mientras no haya storage de imágenes, los lugares sin
 * foto usan una por defecto, y si esa tampoco está, un degradado de marca.
 */
export function PlacePhoto({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const url = src ?? DEFAULT_PHOTO;

  if (!failed) {
    return (
      <img
        src={url}
        alt={src ? alt : ""}
        // Sin foto propia es decorativa: no describe este lugar en concreto.
        aria-hidden={src ? undefined : true}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — sin foto todavía`}
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-lilac-200 via-lilac-100 to-lilac-300",
        className,
      )}
    >
      <PiForkKnifeBold className="h-10 w-10 text-lilac-400" aria-hidden="true" />
    </div>
  );
}
