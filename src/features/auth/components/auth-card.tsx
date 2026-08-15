import { Link } from "react-router-dom";

type AuthCardProps = {
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  children: React.ReactNode;
};

export function AuthCard({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-lilac-200/50">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Derulis
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>

      <div className="mt-8">{children}</div>

      <p className="mt-6 text-center text-sm text-muted">
        {footerText}{" "}
        <Link
          to={footerLinkTo}
          className="font-semibold text-primary hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  );
}
