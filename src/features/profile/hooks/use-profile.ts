import { useMutation } from "@tanstack/react-query";
import { updateStoredUser } from "@/lib/auth-storage";
import { changePassword, updateProfile } from "../api/profile.api";
import type { ChangePasswordInput } from "../api/profile.api";

/**
 * El usuario logueado vive en localStorage y no en react-query (ver
 * `useCurrentUser`), así que el nombre nuevo se escribe ahí:
 * `updateStoredUser` avisa a quien esté suscripto y el cambio se ve al toque
 * en el perfil y en el menú lateral.
 */
export function useUpdateName() {
  return useMutation({
    mutationFn: (name: string) => updateProfile(name),
    meta: { success: "Nombre actualizado", errorMessage: "No pudimos guardar el nombre" },
    onSuccess: (profile) => updateStoredUser({ name: profile.name }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    // El formulario muestra el error arriba: "la actual no es correcta" hay
    // que leerlo junto al campo, no en un toast que se va.
    meta: { silent: true, success: "Contraseña actualizada" },
  });
}
