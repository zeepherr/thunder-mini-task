import type { SupabaseClient, User } from "@supabase/supabase-js";

export class AuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ hasActiveSession: boolean }> {
    const { data, error } = await this.supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    return { hasActiveSession: data.session !== null };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async restoreUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session?.user ?? null;
  }

  subscribe(onUserChange: (user: User | null) => void): () => void {
    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((_event, session) => {
      onUserChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }
}
