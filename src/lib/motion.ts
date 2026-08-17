import type { Transition, Variants } from "framer-motion";

/**
 * Vocabulario de movimiento de la app. Vive acá y no en cada componente para
 * que todo se mueva con la misma curva y los mismos tiempos: si cada pantalla
 * inventa su duración, la app se siente hecha de partes distintas.
 *
 * Regla general: nada dura más de 300ms. Es una app de celular, el
 * movimiento acompaña, no entretiene.
 */

/** easeOutQuint: arranca rápido y frena suave. Se siente nativo. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const pageTransition: Transition = { duration: 0.22, ease: EASE };

/** Entrada y salida de pantalla completa, al cambiar de ruta. */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/**
 * Contenedor de una lista: no se anima él, solo escalona a sus hijos.
 * Va junto a `itemVariants` en cada elemento.
 *
 * 0.1s entre tarjetas: suficiente para leer que entran de a una, sin que la
 * última se haga esperar (con cuatro por página, la tanda entra en ~0.7s).
 */
export const listVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** Un ítem de lista: sube, se agranda un poco y aparece. */
export const itemVariants: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: EASE },
  },
};

/** Aparición simple, sin desplazamiento: para bloques que ya están en su sitio. */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/** Respuesta al toque. Compartida por botones, chips y tarjetas. */
export const tap = { scale: 0.97 };
