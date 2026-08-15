import { Outlet } from "react-router-dom";
import hero from "@/assets/hero.png";

export function PublicLayout() {
  return (
    <div className="min-h-svh bg-lilac-50">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col lg:flex-row">
        <section className="relative h-48 shrink-0 overflow-hidden lg:h-auto lg:flex-1">
          <img
            src={hero}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lilac-700/70 to-lilac-500/20" />
          <div className="absolute inset-x-0 bottom-0 hidden p-10 text-white lg:block">
            <h2 className="text-4xl font-semibold tracking-tight">
              Puntuá cada comida, no solo el lugar
            </h2>
            <p className="mt-3 max-w-md text-lg text-white/90">
              Registrá dónde comiste, puntuá plato por plato e invitá a tus
              amigos para comparar lo que opinó cada uno.
            </p>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-5 py-8 lg:px-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
