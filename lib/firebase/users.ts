import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./config";

export type UserRole = "admin" | "visiteur";

export interface UserProfile {
  uid: string;
  nom: string;
  telephone: string;
  role: UserRole;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(doc(db, "users", profile.uid), profile);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function getUserProfiles(uids: string[]): Promise<Map<string, UserProfile>> {
  if (uids.length === 0) return new Map();
  const q = query(collection(db, "users"), where("uid", "in", uids));
  const snap = await getDocs(q);
  const map = new Map<string, UserProfile>();
  snap.docs.forEach((d) => {
    const p = d.data() as UserProfile;
    map.set(p.uid, p);
  });
  return map;
}

export function phoneToEmail(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `${digits}@etg.app`;
}
