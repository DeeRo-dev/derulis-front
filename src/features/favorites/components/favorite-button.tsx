import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useFavoriteIds, useToggleFavorite } from "../hooks/use-favorites";

/**
 * Corazón para guardar un lugar.
 *
 * `variant="overlay"` va encima de una foto (lleva fondo propio para
 * despegarse); `"bare"` va sobre una superficie lisa, como la barra
 * superior del detalle.
 */
export function FavoriteButton({
  placeId,
  placeName,
  variant = "overlay",
  className,
}: {
  placeId: number;
  placeName: string;
  variant?: "overlay" | "bare";
  className?: string;
}) {
  const { data: ids } = useFavoriteIds();
  const toggle = useToggleFavorite();

  const favorite = ids?.has(placeId) ?? false;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      /* `aria-pressed` y no un label que cambia: el lector de pantalla
         anuncia el estado sin que el nombre del botón mute. */
      aria-pressed={favorite}
      aria-label={`Guardar ${placeName} en favoritos`}
      onClick={(event) => {
        /* La tarjeta entera es un link al lugar: sin esto, guardar
           navegaría también. */
        event.preventDefault();
        event.stopPropagation();
        toggle.mutate({ placeId, favorite: !favorite });
      }}
      className={cn(
        "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "overlay"
          ? "bg-white/95 shadow backdrop-blur"
          : "hover:bg-lilac-100",
        favorite ? "text-error" : "text-muted hover:text-foreground",
        className,
      )}
    >
      <motion.span
        // Un latido al guardar: confirma el gesto sin un cartel.
        animate={favorite ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.32, ease: EASE }}
        className="flex"
      >
        <FiHeart
          className={cn("h-4 w-4", favorite && "fill-current")}
          aria-hidden="true"
        />
      </motion.span>
    </motion.button>
  );
}
