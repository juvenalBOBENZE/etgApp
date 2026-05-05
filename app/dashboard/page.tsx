"use client";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MembersTable } from "@/components/members/MembersTable";
import { MemberDialog } from "@/components/members/MemberDialog";
import { Button } from "@/components/ui/Button";
import { useMembers } from "@/hooks/useMembers";
import type { Member } from "@/types/member";
import type { MemberFormValues } from "@/lib/validations/member";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { members, loading, add, update, remove } = useMembers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Member | undefined>();

  function openAdd() {
    setSelected(undefined);
    setDialogOpen(true);
  }

  function openEdit(member: Member) {
    setSelected(member);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
    setSelected(undefined);
  }

  async function handleSubmit(data: MemberFormValues) {
    try {
      if (selected) {
        await update(selected.id, data);
      } else {
        await add(data);
      }
      handleClose();
    } catch {
      toast.error("Une erreur est survenue");
    }
  }

  async function handleDelete(member: Member) {
    const confirmed = window.confirm(
      `Supprimer ${member.nom} ${member.postNom} ${member.prenom} ?`
    );
    if (!confirmed) return;
    try {
      await remove(member.id);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  return (
    <>
      <Header title=" Gestion des Âmes" />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Total */}
          <div className="bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-100 flex items-center justify-center">
              <Users size={20} className="text-brand-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-brand-700">
                {members.length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Membres total</p>
            </div>
          </div>

          {/* Hommes */}
          <div className="bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">
                {members.filter((m) => m.genre === "Homme").length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Hommes</p>
            </div>
          </div>

          {/* Femmes */}
          <div className="bg-white rounded-xl border p-4 sm:p-5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <Users size={20} className="text-pink-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-pink-700">
                {members.filter((m) => m.genre === "Femme").length}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Femmes</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Liste des membres
            </h2>

            <Button onClick={openAdd} className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Plus size={16} />
              Ajouter
            </Button>
          </div>

          {/* Table responsive */}
          <div className="w-full overflow-x-auto">
            <MembersTable
              members={members}
              loading={loading}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      <MemberDialog
        open={dialogOpen}
        member={selected}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}