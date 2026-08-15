import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

/** Barra superior de las pantallas de detalle: volver + acciones. */
export function DetailTopBar({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 -mx-5 flex h-14 items-center justify-between bg-lilac-50/95 px-5 backdrop-blur">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}
