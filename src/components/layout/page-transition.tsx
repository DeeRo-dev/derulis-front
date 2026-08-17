import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition, pageVariants } from "@/lib/motion";

/**
 * Transición entre rutas. Reemplaza al `<Outlet />` de los layouts.
 *
 * Usa `useOutlet()` en vez de `<Outlet />`: al renderizar el elemento como
 * hijo del nodo con `key`, React conserva la pantalla vieja mientras sale.
 * Con `<Outlet />` adentro, el nodo que se está yendo ya mostraría la ruta
 * nueva y la animación de salida no se vería.
 *
 * `initial={false}`: en la primera carga la pantalla ya está donde tiene que
 * estar, no aparece deslizándose.
 */
export function PageTransition() {
  const outlet = useOutlet();
  const { pathname } = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
