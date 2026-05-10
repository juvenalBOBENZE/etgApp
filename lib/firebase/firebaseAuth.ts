import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile, phoneToEmail } from "./users";

export async function signIn(emailOrPhone: string, password: string): Promise<User> {
  const email = emailOrPhone.includes("@") ? emailOrPhone : phoneToEmail(emailOrPhone);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function registerVisiteur(
  nom: string,
  telephone: string,
  password: string
): Promise<User> {
  const email = phoneToEmail(telephone);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile({
    uid: cred.user.uid,
    nom,
    telephone,
    role: "visiteur",
  });
  return cred.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
