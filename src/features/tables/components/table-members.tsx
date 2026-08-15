import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";
import type { Diner } from "../types";

export function TableMembers({
  tableId,
  members,
}: {
  tableId: number;
  members: Diner[];
}) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-muted">
        Comensales ({members.length})
      </h2>

      <ul className="mt-3 flex flex-wrap items-center gap-2">
        {members.map((member) => (
          <li key={member.id}>
            <Avatar
              name={member.name}
              src={member.avatarUrl}
              size="lg"
              className="ring-2 ring-white"
            />
            <span className="sr-only">{member.name}</span>
          </li>
        ))}

        <li>
          <Link
            to={`/tables/${tableId}/invite`}
            aria-label="Invitar comensales"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-lilac-300 text-lilac-600 transition hover:border-primary hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <FiPlus className="h-5 w-5" aria-hidden="true" />
          </Link>
        </li>
      </ul>
    </section>
  );
}
