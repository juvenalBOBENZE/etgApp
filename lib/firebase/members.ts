import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getUserProfiles } from "./users";
import { db } from "./config";
import type { Member, MemberInput } from "@/types/member";

const COL = "members";

function toMember(id: string, data: Record<string, unknown>): Member {
  const toISO = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : String(v ?? "");
  return {
    id,
    nom: String(data.nom ?? ""),
    postNom: data.postNom ? String(data.postNom) : undefined,
    prenom: data.prenom ? String(data.prenom) : undefined,
    genre: data.genre ? (data.genre as Member["genre"]) : undefined,
    situationMatrimoniale: data.situationMatrimoniale
      ? (data.situationMatrimoniale as Member["situationMatrimoniale"])
      : undefined,
    telephone: String(data.telephone ?? ""),
    avenue: data.avenue ? String(data.avenue) : undefined,
    quartier: data.quartier ? String(data.quartier) : undefined,
    commune: data.commune ? String(data.commune) : undefined,
    commentaire: data.commentaire ? String(data.commentaire) : undefined,
    addedBy: data.addedBy ? String(data.addedBy) : undefined,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

async function phoneExists(telephone: string, excludeId?: string): Promise<boolean> {
  const q = query(collection(db, COL), where("telephone", "==", telephone));
  const snap = await getDocs(q);
  if (snap.empty) return false;
  if (excludeId) return snap.docs.some((d) => d.id !== excludeId);
  return true;
}

export async function getMembers(): Promise<Member[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toMember(d.id, d.data() as Record<string, unknown>));
}

export async function addMember(input: MemberInput, addedBy?: string): Promise<string> {
  if (await phoneExists(input.telephone)) {
    throw new Error("Ce numéro de téléphone est déjà enregistré");
  }
  const ref = await addDoc(collection(db, COL), {
    ...input,
    ...(addedBy ? { addedBy } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMember(id: string, input: MemberInput): Promise<void> {
  if (await phoneExists(input.telephone, id)) {
    throw new Error("Ce numéro de téléphone est déjà enregistré");
  }
  await updateDoc(doc(db, COL, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMember(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export interface DayStat {
  date: string;
  count: number;
}

export interface TopVisiteur {
  uid: string;
  nom: string;
  count: number;
  rank: number;
}

function getWeekBounds(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

export async function getTopVisiteursThisWeek(): Promise<TopVisiteur[]> {
  const { start, end } = getWeekBounds();
  const q = query(
    collection(db, COL),
    where("createdAt", ">=", Timestamp.fromDate(start)),
    where("createdAt", "<", Timestamp.fromDate(end))
  );
  const snap = await getDocs(q);

  const counts = new Map<string, number>();
  snap.docs.forEach((d) => {
    const uid = d.data().addedBy as string | undefined;
    if (uid) counts.set(uid, (counts.get(uid) ?? 0) + 1);
  });

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (sorted.length === 0) return [];

  const uids = sorted.map(([uid]) => uid);
  const profiles = await getUserProfiles(uids);

  return sorted.map(([uid, count], i) => ({
    uid,
    nom: profiles.get(uid)?.nom ?? "Inconnu",
    count,
    rank: i + 1,
  }));
}

export async function getMemberStatsByUser(uid: string): Promise<{ total: number; byDay: DayStat[] }> {
  const q = query(collection(db, COL), where("addedBy", "==", uid));
  const snap = await getDocs(q);
  const dayMap = new Map<string, { label: string; ts: number; count: number }>();

  snap.docs.forEach((d) => {
    const data = d.data();
    const raw = data.createdAt;
    const date = raw instanceof Timestamp ? raw.toDate() : new Date();
    const label = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const key = label;
    const prev = dayMap.get(key);
    dayMap.set(key, { label, ts: date.getTime(), count: (prev?.count ?? 0) + 1 });
  });

  const byDay: DayStat[] = Array.from(dayMap.values())
    .sort((a, b) => b.ts - a.ts)
    .map(({ label, count }) => ({ date: label, count }));

  return { total: snap.size, byDay };
}
