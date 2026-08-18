import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { EASE, tap } from "@/lib/motion";

/**
 * Atajo para registrar un lugar desde el home.
 *
 * Flota porque tiene que estar a mano en cualquier punto del listado: la
 * situación real es estar en el restaurante, con el teléfono en la mano.
 *
 * El contenedor repite el ancho de la columna (`max-w-md`) para que en
 * pantallas grandes el botón quede pegado al contenido y no perdido contra
 * el borde derecho de la ventana.
 */
export function NewPlaceFab() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto flex max-w-md justify-end px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE, delay: 0.2 }}
        whileTap={tap}
        className="pointer-events-auto"
      >
        <Link
          to="/places/new"
          className="flex h-14 items-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-xl shadow-lilac-300/60 transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <FiPlus className="h-5 w-5 shrink-0" aria-hidden="true" />
          Registrar Lugar
        </Link>
      </motion.div>
    </div>
  );
}
