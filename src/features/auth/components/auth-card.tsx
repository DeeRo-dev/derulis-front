import { Link } from "react-router-dom";

type AuthCardProps = {
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: React.ReactNode;
};

/**
 * El contenido de login y registro.
 *
 * No dibuja una tarjeta propia: la hoja blanca la pone `PublicLayout`, y
 * meter una tarjeta adentro de otra dejaría dos bordes redondeados uno
 * dentro del otro.
 */
export function AuthCard({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthCardProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
          Derulis
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-base leading-6 text-muted">{description}</p>
      </div>

      <div className="mt-7">{children}</div>

      {/* mt-auto: el pie queda abajo de todo en el celular, sin importar
          cuántos campos tenga el formulario. */}
      <p className="mt-auto pt-8 text-center text-sm text-muted">
        {footerText}{" "}
        <Link
          to={footerLinkTo}
          className="font-bold text-primary hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  );
}
