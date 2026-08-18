import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

/**
 * Los avisos flotantes de la app.
 *
 * Van arriba y no abajo: en celular el pulgar y el teclado viven abajo, y
 * un cartel ahí tapa justo el botón que la persona acaba de tocar.
 *
 * Los colores salen de los tokens del sistema (ver index.css) en vez del
 * tema propio de Sonner, que es gris neutro y desentona con el lila.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      /* 4s: alcanza para leer una línea sin quedarse en el medio. Los
         errores se cierran a mano — ver `duration` en los toasts de error. */
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border-0 !bg-white !text-foreground !shadow-xl !shadow-lilac-900/10 !font-sans",
          description: "!text-muted",
          success: "!text-foreground",
          error: "!text-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-full",
          closeButton: "!bg-white !border-lilac-200 !text-muted",
        },
      }}
      icons={{
        success: <span className="text-success">●</span>,
        error: <span className="text-error">●</span>,
      }}
      {...props}
    />
  );
}
