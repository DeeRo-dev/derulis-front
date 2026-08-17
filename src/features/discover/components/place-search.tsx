import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight, FiX } from "react-icons/fi";
import { PiPizza, PiBowlSteam, PiMartini } from "react-icons/pi";
import type { IconType } from "react-icons";
import { itemVariants, listVariants, tap } from "@/lib/motion";

/** Atajos: escriben en el buscador, no son categorías del backend. */
const SHORTCUTS: { label: string; icon: IconType }[] = [
  { label: "Pizza", icon: PiPizza },
  { label: "Ramen", icon: PiBowlSteam },
  { label: "Bares", icon: PiMartini },
];

export function PlaceSearch({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (term: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(draft.trim());
  };

  const clear = () => {
    setDraft("");
    onSearch("");
  };

  return (
    <div className="mt-4">
      <form onSubmit={submit} role="search">
        <label htmlFor="place-search" className="sr-only">
          Buscar lugares
        </label>

        {/* El anillo al enfocar se anima en vez de aparecer de golpe: es la
            única pista de que el teclado va a escribir acá. */}
        <motion.div
          animate={{
            boxShadow: focused
              ? "0 0 0 2px var(--color-primary)"
              : "0 0 0 0px rgba(115, 67, 224, 0)",
          }}
          transition={{ duration: 0.18 }}
          className="flex items-center gap-2 rounded-2xl bg-lilac-100 p-1.5 pl-4"
        >
          <FiSearch
            className="h-5 w-5 shrink-0 text-muted"
            aria-hidden="true"
          />
          <input
            id="place-search"
            type="search"
            placeholder="Buscar restaurantes, platos, amigos"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted"
          />

          {value ? (
            <motion.button
              type="button"
              onClick={clear}
              aria-label="Limpiar búsqueda"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={tap}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          ) : null}

          <motion.button
            type="submit"
            aria-label="Buscar"
            whileTap={tap}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <FiArrowRight className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </form>

      <motion.div
        variants={listVariants}
        initial="initial"
        animate="animate"
        className="mt-4 grid grid-cols-3 gap-2"
      >
        {SHORTCUTS.map(({ label, icon: Icon }) => {
          const active = value === label;

          return (
            <motion.button
              key={label}
              type="button"
              variants={itemVariants}
              whileTap={tap}
              aria-pressed={active}
              onClick={() => {
                setDraft(label);
                onSearch(label);
              }}
              className={
                active
                  ? "flex items-center justify-center gap-2 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  : "flex items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
