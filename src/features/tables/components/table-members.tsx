import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import type { Diner } from "../types";

/**
 * Cuántas caras se muestran antes de resumir el resto en un "+N".
 *
 * Con seis la fila entra sin cortarse en la pantalla más angosta que
 * soportamos, contando el botón de invitar.
 */
const MAX_SHOWN = 6;

export function TableMembers({
  tableId,
  members,
}: {
  tableId: number;
  members: Diner[];
}) {
  const shown = members.slice(0, MAX_SHOWN);
  const rest = members.length - shown.length;

  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-muted">
        Comensales ({members.length})
      </h2>

      <div className="mt-3 flex items-center">
        {/* Superpuestos: se lee como un grupo, uno al lado del otro se lee
            como una lista. El anillo blanco es lo que separa una cara de
            la siguiente, así que no es decoración. */}
        <ul className="flex -space-x-3">
          {shown.map((member) => (
            <li key={member.id}>
              <Avatar
                name={member.name}
                src={member.avatarUrl}
                size="lg"
                className="ring-[3px] ring-white"
              />
              <span className="sr-only">{member.name}</span>
            </li>
          ))}

          {rest > 0 ? (
            <li
              aria-label={`y ${rest} más`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-lilac-200 text-sm font-semibold text-lilac-700 ring-[3px] ring-white"
            >
              +{rest}
            </li>
          ) : null}
        </ul>

        {/* Separado de la pila: es una acción, no un comensal más. */}
        <Link
          to={`/tables/${tableId}/invite`}
          aria-label="Invitar comensales"
          className="ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-lilac-300 text-lilac-600 transition hover:border-primary hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <FiPlus className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
