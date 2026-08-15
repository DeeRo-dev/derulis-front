import { Link } from "react-router-dom";
import { FiPlus, FiClock, FiKey } from "react-icons/fi";

export function CreateTableCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg shadow-lilac-200/50">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lilac-100 px-3 py-1 text-xs font-semibold text-lilac-700">
        <FiClock className="h-3.5 w-3.5" aria-hidden="true" />
        Plan de hoy
      </span>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        Armá una mesa
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Invitá a tus amigos, armá la mesa y decidan juntos dónde comer. O
        registrala solo, si comés por tu cuenta.
      </p>

      <Link
        to="/tables/new"
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <FiPlus className="h-5 w-5" aria-hidden="true" />
        Empezar una mesa
      </Link>

      <Link
        to="/tables/join"
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-lilac-300 bg-white px-6 text-base font-semibold text-primary transition-colors hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <FiKey className="h-5 w-5" aria-hidden="true" />
        Unirme con código
      </Link>
    </section>
  );
}
