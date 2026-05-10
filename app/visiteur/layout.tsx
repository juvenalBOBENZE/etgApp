import { AuthGuard } from "@/components/layout/AuthGuard";

export default function VisiteurLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard requiredRole="visiteur">{children}</AuthGuard>;
}
