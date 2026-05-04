"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NAV = [
  { href: "/dashboard", label: "Membres", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-brand-700 flex flex-col text-white shadow-xl">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 px-4 py-6 border-b border-brand-600">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
          <Image src="/logo.png" alt="ETG Logo" width={64} height={64} className="object-cover" />
        </div>
        <div className="text-center">
          <p className="text-xs font-light text-brand-200 uppercase tracking-widest">Église</p>
          <p className="font-bold text-sm leading-tight">Terre de Grâce</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-white text-brand-700"
                : "text-brand-100 hover:bg-brand-600"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-brand-600">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-brand-200 hover:bg-brand-600 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
