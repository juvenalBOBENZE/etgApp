"use client";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/firebaseAuth";
import { getUserProfile, UserProfile } from "@/lib/firebase/users";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const p = await getUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    role: profile?.role ?? null,
  };
}
