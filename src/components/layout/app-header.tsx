import { FiBell } from "react-icons/fi";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 bg-lilac-50/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-md items-center justify-between px-5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiBell className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="text-lg font-bold tracking-tight text-primary">
          Derulis
        </span>

        {/* A la derecha: es donde cae el pulgar. La campana se usa mucho
            menos, así que se va al lado incómodo. */}
        <SidebarTrigger />
      </div>
    </header>
  );
}
