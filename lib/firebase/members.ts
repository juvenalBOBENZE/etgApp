import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Member, MemberInput } from "@/types/member";

const COL = "members";

function toMember(id: string, data: Record<string, unknown>): Member {
  const toISO = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : String(v ?? "");
  return {
    id,
    nom: String(data.nom ?? ""),
    postNom: String(data.postNom ?? ""),
    prenom: String(data.prenom ?? ""),
    genre: data.genre as Member["genre"],
    situationMatrimoniale: data.situationMatrimoniale as Member["situationMatrimoniale"],
    telephone: String(data.telephone ?? ""),
    avenue: String(data.avenue ?? ""),
    quartier: String(data.quartier ?? ""),
    commune: String(data.commune ?? ""),
    commentaire: data.commentaire ? String(data.commentaire) : undefined,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

export async function getMembers(): Promise<Member[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toMember(d.id, d.data() as Record<string, unknown>));
}

export async function addMember(input: MemberInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMember(id: string, input: MemberInput): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
