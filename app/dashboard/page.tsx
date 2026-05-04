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
      <Header title="Gestion des Membres" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
              <Users size={22} className="text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-700">{members.length}</p>
              <p className="text-sm text-gray-500">Membres total</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">
                {members.filter((m) => m.genre === "Homme").length}
              </p>
              <p className="text-sm text-gray-500">Hommes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <Users size={22} className="text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-700">
                {members.filter((m) => m.genre === "Femme").length}
              </p>
              <p className="text-sm text-gray-500">Femmes</p>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Liste des membres</h2>
            <Button onClick={openAdd}>
              <Plus size={16} />
              Ajouter un membre
            </Button>
          </div>

          <MembersTable
            members={members}
            loading={loading}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
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
