import { z } from "zod";

/* Espeja las reglas de class-validator del backend
   (places/dto/create-place.dto.ts). Si allá cambian, cambiarlas acá. */

export const newPlaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar los 120 caracteres"),

  description: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres"),

  /* Se acepta el link completo o el @handle: `toInstagramHandle` recorta lo
     que sobra antes de mandarlo. Acá solo se descarta lo que no puede ser
     un usuario. */
  instagram: z
    .string()
    .trim()
    .max(120, "El usuario de Instagram es demasiado largo"),

  address: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres")
    .max(200, "La dirección no puede superar los 200 caracteres"),

  city: z.string().trim().max(120, "La ciudad es demasiado larga"),
  province: z.string().trim().max(120, "La provincia es demasiado larga"),

  /* Opcional: vacío pasa. Escrito, se valida laxo —cada país escribe sus
     teléfonos distinto— y solo se rechaza lo que no puede ser uno. */
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^[0-9+()\-.\s]{6,30}$/.test(value),
      "Revisá el teléfono: solo números, espacios y + ( ) - .",
    ),

  /* Sin punto el lugar no se puede señalar en el mapa, así que el backend
     lo rechaza. No son campos que se escriban: los completa el mapa. */
  latitude: z.number({ error: "Marcá en el mapa dónde queda" }),
  longitude: z.number({ error: "Marcá en el mapa dónde queda" }),
});

export type NewPlaceValues = z.infer<typeof newPlaceSchema>;
