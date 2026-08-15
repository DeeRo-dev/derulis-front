import { useState } from "react";
import { FiSearch, FiArrowRight, FiX } from "react-icons/fi";

/** Atajos: escriben en el buscador, no son categorías del backend. */
const SHORTCUTS = ["Pizza", "Sushi", "Parrilla", "Café"];

export function PlaceSearch({
  value,
  onSearch,
}: {
  value: string;
  onSearch: (term: string) => void;
}) {
  const [draft, setDraft] = useState(value);

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

        <div className="flex items-center gap-2 rounded-2xl bg-lilac-100 p-1.5 pl-4">
          <FiSearch
            className="h-5 w-5 shrink-0 text-muted"
            aria-hidden="true"
          />
          <input
            id="place-search"
            type="search"
            placeholder="Buscar restaurantes"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted"
          />

          {value ? (
            <button
              type="button"
              onClick={clear}
              aria-label="Limpiar búsqueda"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <FiX className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}

          <button
            type="submit"
            aria-label="Buscar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <FiArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut}
            type="button"
            onClick={() => {
              setDraft(shortcut);
              onSearch(shortcut);
            }}
            className="shrink-0 rounded-full border border-lilac-300 bg-white px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {shortcut}
          </button>
        ))}
      </div>
    </div>
  );
}
