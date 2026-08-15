import { useState } from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

/** Ver PlacePhoto: en `public/` para que un archivo faltante no rompa el build. */
const DEFAULT_PHOTO = "/default-table.jpg";

/**
 * Foto de la mesa, con una cadena de respaldo:
 *   1. la foto propia de la mesa (editable más adelante)
 *   2. la del último lugar visitado — es real y dice algo del grupo
 *   3. la imagen por defecto
 *   4. un degradado de marca, si esa tampoco está
 */
export function TablePhoto({
  src,
  fallbackSrc,
  alt,
  className,
}: {
  src: string | null;
  fallbackSrc?: string | null;
  alt: string;
  className?: string;
}) {
  const chain = [src, fallbackSrc, DEFAULT_PHOTO].filter(
    (value): value is string => Boolean(value),
  );
  const [index, setIndex] = useState(0);

  const url = chain[index];
  const isOwn = index === 0 && Boolean(src);

  if (url) {
    return (
      <img
        src={url}
        alt={isOwn ? alt : ""}
        aria-hidden={isOwn ? undefined : true}
        // Eager a propósito: es la cabecera, está sobre el pliegue. Con lazy
        // el navegador la posterga y la pantalla arranca con un hueco.
        loading="eager"
        onError={() => setIndex((current) => current + 1)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${alt} — sin foto todavía`}
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-lilac-300 via-lilac-200 to-lilac-400",
        className,
      )}
    >
      <PiUsersThreeFill
        className="h-12 w-12 text-lilac-500"
        aria-hidden="true"
      />
    </div>
  );
}
