import { PiForkKnifeBold } from "react-icons/pi";
import { cn } from "@/lib/utils";

/**
 * Foto del lugar. Mientras no haya storage de imágenes, los lugares sin foto
 * caen a un placeholder de marca en vez de un hueco roto
 * (brief, sección 5: "photoUrl apunta a una imagen por defecto").
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
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
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
