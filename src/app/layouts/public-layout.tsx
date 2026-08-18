import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { PageTransition } from "@/components/layout/page-transition";

/* Vive en public/ y no en assets/: es una foto grande que no gana nada con
   pasar por el bundler, igual que las imágenes por defecto de lugares y
   mesas. */
const HERO = "/encuentro.jpg";

/**
 * Volver, solo si hay a dónde.
 *
 * `location.key` vale "default" cuando esta es la primera pantalla de la
 * sesión de navegación: ahí una flecha atrás no llevaría a ningún lado, y
 * un control que no hace nada es peor que no tenerlo.
 */
function BackButton() {
  const navigate = useNavigate();
  const { key } = useLocation();

  if (key === "default") return null;

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Volver"
      className="absolute left-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
    >
      <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

/**
 * Login y registro: la foto ocupa la mitad de arriba y el formulario entra
 * como una hoja montada sobre ella.
 *
 * En escritorio la misma foto pasa a ser la columna izquierda, donde sí hay
 * lugar para el texto de presentación.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-lilac-50 lg:h-svh lg:flex-row">
      <section className="relative h-[34svh] shrink-0 overflow-hidden lg:h-full lg:flex-1">
        <img
          src={HERO}
          alt=""
          /* absolute: una foto vertical con `h-full` dentro de una sección
             sin alto propio termina imponiendo el suyo y estirando la
             página entera. Fuera del flujo no puede. */
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {/* El degradado solo en escritorio: en celular la hoja tapa la parte
            baja de la foto y oscurecerla de más apaga la imagen. */}
        <div className="absolute inset-0 hidden bg-gradient-to-t from-lilac-700/70 to-lilac-500/20 lg:block" />

        <BackButton />

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

      {/* -mt-8: la hoja se monta sobre la foto, que es lo que le da el
          borde redondeado de arriba. En escritorio no hay nada que montar. */}
      <section className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-3xl bg-lilac-50 px-6 pb-8 pt-9 lg:mt-0 lg:h-full lg:items-center lg:justify-center lg:overflow-y-auto lg:rounded-none lg:px-10 lg:py-8">
        <div className="flex w-full max-w-md flex-1 flex-col lg:flex-none">
          <PageTransition className="flex flex-1 flex-col" />
        </div>
      </section>
    </div>
  );
}
