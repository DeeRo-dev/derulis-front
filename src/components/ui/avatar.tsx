import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-12 w-12 text-base",
};

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const base = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full",
    SIZES[size],
    className,
  );

  if (src) {
    return <img src={src} alt="" className={cn(base, "object-cover")} />;
  }

  return (
    <span
      className={cn(base, "bg-lilac-200 font-semibold text-lilac-700")}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/** Pila de avatares superpuestos para los comensales de una mesa. */
export function AvatarStack({
  people,
  max = 3,
}: {
  people: { id: number; name: string }[];
  max?: number;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((person) => (
          <Avatar
            key={person.id}
            name={person.name}
            size="sm"
            className="ring-2 ring-white"
          />
        ))}
      </div>
      {rest > 0 ? (
        <span className="ml-2 text-xs text-muted">+{rest}</span>
      ) : null}
      <span className="sr-only">
        {people.length} {people.length === 1 ? "comensal" : "comensales"}
      </span>
    </div>
  );
}
