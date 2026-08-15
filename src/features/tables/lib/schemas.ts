import { z } from "zod";

export const NAME_MAX = 60;
export const DESCRIPTION_MAX = 280;

export const createTableSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(NAME_MAX, `Máximo ${NAME_MAX} caracteres`),
  // Opcional a propósito: obligar a describir la mesa agrega fricción al
  // paso que más queremos que la gente complete.
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, `Máximo ${DESCRIPTION_MAX} caracteres`),
});

export type CreateTableValues = z.infer<typeof createTableSchema>;
