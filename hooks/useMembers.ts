"use client";
import { useState, useEffect, useCallback } from "react";
import { getMembers, addMember, updateMember, deleteMember } from "@/lib/firebase/members";
import type { Member, MemberInput } from "@/types/member";
import toast from "react-hot-toast";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch {
      toast.error("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const add = useCallback(async (input: MemberInput) => {
    await addMember(input);
    toast.success("Membre ajouté avec succès");
    await fetch();
  }, [fetch]);

  const update = useCallback(async (id: string, input: MemberInput) => {
    await updateMember(id, input);
    toast.success("Membre modifié avec succès");
    await fetch();
  }, [fetch]);

  const remove = useCallback(async (id: string) => {
    await deleteMember(id);
    toast.success("Membre supprimé");
    await fetch();
  }, [fetch]);

  return { members, loading, refresh: fetch, add, update, remove };
}
