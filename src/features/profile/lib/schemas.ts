import { z } from "zod";

/* Espeja las reglas del backend (users/dto). Si cambian allá, acá también. */

export const editNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: z
      .string()
      .min(6, "La contraseña nueva debe tener al menos 6 caracteres"),
    repeatPassword: z.string().min(1, "Repetí la contraseña nueva"),
  })
  /* La repetición se valida solo acá: al backend no le importa, y mandarle
     un campo de más lo haría rechazar el cuerpo entero por `whitelist`. */
  .refine((values) => values.newPassword === values.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "La contraseña nueva tiene que ser distinta de la actual",
    path: ["newPassword"],
  });

export type EditNameValues = z.infer<typeof editNameSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
