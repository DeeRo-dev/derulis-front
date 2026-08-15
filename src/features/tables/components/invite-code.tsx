import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

/** El código se dicta o se pega: se muestra grande y con un solo toque copia. */
export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl bg-lilac-100 px-4 py-3 text-left transition hover:bg-lilac-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span>
        <span className="block text-xs font-medium text-lilac-700">
          Código para invitar
        </span>
        <span className="mt-0.5 block font-mono text-lg font-bold tracking-[0.2em] text-foreground">
          {code}
        </span>
      </span>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lilac-700">
        {copied ? (
          <FiCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <FiCopy className="h-4 w-4" aria-hidden="true" />
        )}
      </span>
      <span className="sr-only">{copied ? "Copiado" : "Copiar código"}</span>
    </button>
  );
}
