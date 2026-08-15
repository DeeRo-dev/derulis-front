import { PiForkKnifeBold } from "react-icons/pi";

/** Placeholder para las secciones que todavía no se construyeron. */
export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mt-6 rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
      <PiForkKnifeBold
        className="mx-auto h-8 w-8 text-lilac-400"
        aria-hidden="true"
      />
      <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </section>
  );
}
