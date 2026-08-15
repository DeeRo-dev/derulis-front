import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

/** El código se dicta o se pega: se muestra grande y con un toque se copia. */
export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-lilac-100 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">
          Código de invitación
        </p>
        <p className="mt-1 truncate font-mono text-2xl font-bold tracking-[0.15em] text-foreground">
          {code}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void copy()}
        aria-label={copied ? "Copiado" : "Copiar código"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lilac-700 shadow-sm transition hover:bg-lilac-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {copied ? (
          <FiCheck className="h-5 w-5" aria-hidden="true" />
        ) : (
          <FiCopy className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
