"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { MemberForm } from "./MemberForm";
import type { Member } from "@/types/member";
import type { MemberFormValues } from "@/lib/validations/member";

interface MemberDialogProps {
  open: boolean;
  member?: Member;
  onClose: () => void;
  onSubmit: (data: MemberFormValues) => Promise<void>;
}

export function MemberDialog({ open, member, onClose, onSubmit }: MemberDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) el.showModal();
    else el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-2xl rounded-xl shadow-2xl p-0 backdrop:bg-black/50 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-brand-600 rounded-t-xl">
        <h2 className="text-lg font-semibold text-white">
          {member ? "Modifier le membre" : "Ajouter un membre"}
        </h2>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-6 py-5 overflow-y-auto max-h-[80vh]">
        <MemberForm
          defaultValues={member}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </dialog>
  );
}
