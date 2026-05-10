"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, LogOut, CalendarDays, Users } from "lucide-react";
import { MemberDialog } from "@/components/members/MemberDialog";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/firebase/firebaseAuth";
import { addMember, getMemberStatsByUser, type DayStat } from "@/lib/firebase/members";
import type { MemberFormValues } from "@/lib/validations/member";
import toast from "react-hot-toast";
import Image from "next/image";

export default function VisiteurPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [byDay, setByDay] = useState<DayStat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    if (!user) return;
    setStatsLoading(true);
    try {
      const stats = await getMemberStatsByUser(user.uid);
      setTotal(stats.total);
      setByDay(stats.byDay);
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshStats(); }, [refreshStats]);

  async function handleSubmit(data: MemberFormValues) {
    if (!user) return;
    try {
      await addMember(data, user.uid);
      setDialogOpen(false);
      toast.success("Membre ajouté avec succès");
      await refreshStats();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-brand-600 flex flex-col items-center p-6 gap-8 pt-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
          <Image src="/logo.png" alt="ETG Logo" width={80} height={80} className="object-cover" />
        </div>
        <div className="text-center text-white">
          <p className="text-xs uppercase tracking-widest opacity-70">Église</p>
          <h1 className="text-2xl font-bold">Terre de Grâce</h1>
          {profile?.nom && (
            <p className="text-sm opacity-80 mt-1">Bonjour, {profile.nom}</p>
          )}
        </div>
      </div>

      {/* Bouton principal */}
      <Button
        onClick={() => setDialogOpen(true)}
        size="lg"
        className="flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 shadow-xl px-8 py-4 text-base font-semibold"
      >
        <Plus size={20} />
        Ajouter un membre
      </Button>

      {/* Statistiques */}
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Total */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <div className="text-white">
            <p className="text-2xl font-bold">{statsLoading ? "—" : total}</p>
            <p className="text-sm opacity-70">Membres ajoutés par vous</p>
          </div>
        </div>

        {/* Par jour */}
        {byDay.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white opacity-80">
              <CalendarDays size={16} />
              <span className="text-sm font-medium">Par date</span>
            </div>
            <div className="flex flex-col gap-2">
              {byDay.map(({ date, count }) => (
                <div key={date} className="flex items-center justify-between text-white">
                  <span className="text-sm opacity-70">{date}</span>
                  <span className="font-semibold text-sm bg-white/20 rounded-full px-3 py-0.5">
                    {count} membre{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!statsLoading && total === 0 && (
          <p className="text-white/50 text-sm text-center">Aucun membre ajouté pour l&apos;instant</p>
        )}
      </div>

      {/* Déconnexion */}
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors mt-2"
      >
        <LogOut size={16} />
        Se déconnecter
      </button>

      <MemberDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
