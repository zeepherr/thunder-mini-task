export type AuthUser = {
  id: string;
  email?: string | null;
};

export type AuthSessionState = {
  configured: boolean;
  user: AuthUser | null;
};

type AuthResponse = {
  configured?: boolean;
  user?: AuthUser | null;
  hasActiveSession?: boolean;
  error?: string;
};

const AUTH_CHANGE_EVENT = "my-work-list:auth-change";
const AUTH_CHANGE_STORAGE_KEY = "my-work-list:auth-change";

async function postAuthRoute(path: string, payload?: unknown): Promise<AuthResponse> {
  const response = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
    credentials: "same-origin",
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as AuthResponse;

  if (!response.ok) {
    throw new Error(body.error ?? "Authentication request failed.");
  }

  return body;
}

function publishAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  try {
    window.localStorage.setItem(AUTH_CHANGE_STORAGE_KEY, String(Date.now()));
    window.localStorage.removeItem(AUTH_CHANGE_STORAGE_KEY);
  } catch {
    // The current tab still receives the event when storage is unavailable.
  }
}

export class AuthService {
  async signIn(email: string, password: string): Promise<void> {
    await postAuthRoute("login", { email: email.trim(), password });
    publishAuthChange();
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ hasActiveSession: boolean }> {
    const result = await postAuthRoute("register", {
      email: email.trim(),
      password,
    });
    if (result.hasActiveSession) publishAuthChange();
    return { hasActiveSession: result.hasActiveSession === true };
  }

  async signOut(): Promise<void> {
    await postAuthRoute("logout");
    publishAuthChange();
  }

  async restoreSession(): Promise<AuthSessionState> {
    const response = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    const body = (await response.json().catch(() => ({}))) as AuthResponse;

    if (response.status === 503 && body.configured === false) {
      return { configured: false, user: null };
    }
    if (!response.ok) {
      throw new Error(body.error ?? "Could not restore your session.");
    }

    return {
      configured: body.configured !== false,
      user: body.user ?? null,
    };
  }

  subscribe(onChange: () => void): () => void {
    if (typeof window === "undefined") return () => undefined;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_CHANGE_STORAGE_KEY) onChange();
    };
    window.addEventListener(AUTH_CHANGE_EVENT, onChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", handleStorage);
    };
  }
}
