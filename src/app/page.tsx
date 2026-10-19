import { AuthGate, AuthProvider } from "@/features/auth";

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
