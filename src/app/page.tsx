import { AuthGate, AuthProvider } from "@/features/auth";
import { TaskBoard } from "@/features/tasks";

export default function HomePage() {
  return (
    <AuthProvider>
      <AuthGate>
        <TaskBoard />
      </AuthGate>
    </AuthProvider>
  );
}
