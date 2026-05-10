"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/firebase/users";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    // role===null means legacy admin account with no Firestore profile → allow admin routes
    if (requiredRole && role !== null && role !== requiredRole) {
      router.replace(role === "admin" ? "/dashboard" : "/visiteur");
    }
  }, [user, role, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && role !== null && role !== requiredRole) return null;

  return <>{children}</>;
}
