import { Avatar } from "@/components/ui/avatar";
import type { Diner } from "../types";

/**
 * Quiénes participan de la salida. En modo "estamos visitándolo" entran
 * directo; en modo "próxima cita" quedan invitados hasta que acepten.
 */
export function GuestPicker({
  tableName,
  members,
  selected,
  onToggle,
  onSelectAll,
  invited,
}: {
  tableName: string;
  members: Diner[];
  selected: number[];
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  invited: boolean;
}) {
  const allSelected = members.length > 0 && selected.length === members.length;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Mesa: {tableName}
        </h2>
        <button
          type="button"
          onClick={onSelectAll}
          disabled={allSelected}
          className="text-sm font-semibold text-primary transition hover:underline disabled:opacity-50 disabled:hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Sumar a todos
        </button>
      </div>

      <ul className="mt-3 divide-y divide-lilac-100 overflow-hidden rounded-3xl bg-white shadow-lg shadow-lilac-200/50">
        {members.map((member) => {
          const checked = selected.includes(member.id);
          return (
            <li key={member.id}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-lilac-50 focus-within:bg-lilac-50">
                <Avatar name={member.name} src={member.avatarUrl} size="lg" />
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  {member.name}
                </span>

                {invited && checked ? (
                  <span className="shrink-0 rounded-full bg-lilac-100 px-2.5 py-1 text-xs font-semibold text-lilac-700">
                    Se le avisa
                  </span>
                ) : null}

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(member.id)}
                  className="h-6 w-6 shrink-0 accent-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </label>
            </li>
          );
        })}
      </ul>

      <p className="mt-2 text-sm text-muted">
        {invited
          ? "Los seleccionados quedan invitados y tienen que aceptar."
          : "Seleccioná quiénes están en el lugar. Solo ellos van a poder puntuar."}
      </p>
    </section>
  );
}
