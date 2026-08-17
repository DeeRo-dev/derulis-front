const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export type StoredUser = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/*
 * Suscripción a la sesión guardada.
 *
 * `useCurrentUser` leía localStorage en cada render, sin manera de enterarse
 * de un cambio: al subir un avatar, la foto vieja se quedaba en pantalla
 * hasta recargar. Con esto los componentes se enteran.
 *
 * El snapshot se cachea porque `useSyncExternalStore` compara por
 * identidad: devolver un objeto nuevo en cada lectura sería un bucle de
 * renders infinito.
 */
type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedUser: StoredUser | null = null;

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeToSession(listener: Listener): () => void {
  listeners.add(listener);

  /* `storage` solo dispara en *otras* pestañas. Sirve para que cerrar
     sesión en una se refleje en el resto. */
  const onStorage = (event: StorageEvent) => {
    if (event.key === USER_KEY || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);

  if (raw === cachedRaw) return cachedUser;

  cachedRaw = raw;

  if (!raw) {
    cachedUser = null;
    return null;
  }

  try {
    cachedUser = JSON.parse(raw) as StoredUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    cachedRaw = null;
    cachedUser = null;
  }

  return cachedUser;
}

export function saveSession(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notify();
}

/** Actualiza al usuario guardado sin tocar el token. */
export function updateStoredUser(patch: Partial<StoredUser>) {
  const current = getStoredUser();
  if (!current) return;

  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
  notify();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notify();
}
