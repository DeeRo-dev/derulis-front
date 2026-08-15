import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";
import { TablePhoto } from "@/components/ui/table-photo";

/**
 * Cabecera del detalle: la foto ocupa el ancho completo y los controles
 * flotan encima, así que esta pantalla no usa la barra superior común.
 *
 * `-mx-5` cancela el padding del layout para que la foto llegue al borde.
 */
export function TableHero({
  tableId,
  name,
  photoUrl,
  fallbackPhotoUrl,
}: {
  tableId: number;
  name: string;
  photoUrl: string | null;
  fallbackPhotoUrl?: string | null;
}) {
  const navigate = useNavigate();

  return (
    <div className="relative -mx-5 h-52 overflow-hidden rounded-b-3xl">
      <TablePhoto src={photoUrl} fallbackSrc={fallbackPhotoUrl} alt={name} />

      {/* Degradado: sin él, los botones desaparecen sobre fotos claras. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-foreground shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          to={`/tables/${tableId}/invite`}
          aria-label="Invitar comensales"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiUserPlus className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
