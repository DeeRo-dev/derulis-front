/** Los montos viajan en centavos y nunca como float (ver brief, sección 6). */
export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Rango de precio en signos $, derivado del gasto por persona. */
export function priceLevel(cents: number): string {
  const amount = cents / 100;
  if (amount < 1000) return "$";
  if (amount < 2000) return "$$";
  if (amount < 3500) return "$$$";
  return "$$$$";
}

/** "viernes 24 de octubre • 20:30" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} • ${time}`;
}

/** "12 de junio de 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
