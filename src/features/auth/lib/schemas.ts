import { z } from "zod";

/* Espeja las reglas de class-validator del backend
   (common/dto/auth.dto.ts). Si allá cambian los mínimos, cambiarlos acá. */

const email = z
  .string()
  .trim()
  .min(1, "Ingresá tu email")
  .pipe(z.email("Email inválido"));

export const loginSchema = z.object({
  email,
  // En login no validamos largo: no corresponde filtrar la política de
  // contraseñas de una cuenta que ya existe.
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email,
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
