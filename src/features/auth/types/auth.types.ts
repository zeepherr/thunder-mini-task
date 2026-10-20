export type AuthUser = {
  id: string;
  email?: string | null;
};

export type AuthSessionState = {
  configured: boolean;
  user: AuthUser | null;
};
