import { PageTransition } from "@/components/layout/page-transition";

/**
 * Para pantallas de detalle: sin la cabecera global, porque cada una trae
 * su propia barra con "volver" y sus acciones.
 */
export function DetailLayout() {
  return (
    <div className="min-h-svh bg-lilac-50">
      <main className="mx-auto w-full max-w-md px-5 pb-12">
        <PageTransition />
      </main>
    </div>
  );
}
