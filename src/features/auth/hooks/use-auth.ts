import { useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import {
  clearSession,
  getStoredUser,
  saveSession,
  subscribeToSession,
} from "@/lib/auth-storage";
import * as authApi from "../api/auth.api";
import type { AuthResponse } from "../api/auth.api";

function useAuthSuccess() {
  const navigate = useNavigate();

  return (data: AuthResponse) => {
    saveSession(data.accessToken, data.user);
    navigate("/discover", { replace: true });
  };
}

export function useLogin() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess,
    retry: false,
  });
}

export function useRegister() {
  const onSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess,
    retry: false,
  });
}

export function useLogout() {
  const navigate = useNavigate();

  return () => {
    clearSession();
    queryClient.clear();
    navigate("/login", { replace: true });
  };
}

/**
 * El usuario de la sesión. Se suscribe al almacenamiento para que un cambio
 * —subir un avatar, cerrar sesión en otra pestaña— repinte lo que lo usa.
 */
export function useCurrentUser() {
  return useSyncExternalStore(subscribeToSession, getStoredUser);
}
