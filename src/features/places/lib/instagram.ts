/**
 * El backend guarda el usuario de Instagram, no una URL. Aceptamos que el
 * usuario pegue el link completo o el @handle y extraemos el usuario.
 */
export function toInstagramHandle(raw: string): string | undefined {
  const clean = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");

  return clean.length > 0 ? clean : undefined;
}
