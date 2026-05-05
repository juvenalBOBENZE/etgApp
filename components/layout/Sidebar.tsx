"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/firebase/firebaseAuth";
import Image from "next/image";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/dashboard", label: "Membres", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 px-4 py-8 border-b border-brand-600/50">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center ring-2 ring-white/10">
          <Image src="/logo.png" alt="ETG Logo" width={64} height={64} className="object-cover" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-light text-brand-200 uppercase tracking-[0.2em]">Église</p>
          <p className="font-semibold text-sm leading-tight mt-0.5">Terre de Grâce</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-brand-100 hover:bg-brand-600/60 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-brand-600/50">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-brand-200 hover:bg-brand-600/60 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* === MOBILE TOPBAR === */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-brand-700 text-white px-4 h-14 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <Image src="/logo.png" alt="ETG Logo" width={32} height={32} className="object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-[9px] font-light text-brand-200 uppercase tracking-widest">Église</p>
            <p className="font-semibold text-xs">Terre de Grâce</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 -mr-2 rounded-lg hover:bg-brand-600 transition-colors"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* === MOBILE OVERLAY === */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* === MOBILE DRAWER === */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] bg-brand-700 text-white flex flex-col shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Fermer le menu"
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-brand-600 transition-colors z-10"
        >
          <X size={20} />
        </button>
        {SidebarContent}
      </aside>

      {/* === DESKTOP SIDEBAR === */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen bg-brand-700 text-white shadow-xl">
        {SidebarContent}
      </aside>
    </>
  );
}