"use client";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle } from "lucide-react";
import { InstallPWA } from "./InstallPWA";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <InstallPWA />
        <UserCircle size={20} className="text-brand-600" />
        <span>{user?.email ?? "Admin"}</span>
      </div>
    </header>
  );
}
