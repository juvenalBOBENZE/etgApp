"use client";
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { getTopVisiteursThisWeek, type TopVisiteur } from "@/lib/firebase/members";

const MEDAL = ["🥇", "🥈", "🥉"];

function getWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

export function TopVisiteurs() {
  const [top, setTop] = useState<TopVisiteur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopVisiteursThisWeek()
      .then(setTop)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-brand-600" />
        <h2 className="text-base font-semibold text-gray-800">Top membres — semaine</h2>
        <span className="ml-auto text-xs text-gray-400">{getWeekLabel()}</span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && top.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          Aucun ajout cette semaine
        </p>
      )}

      {!loading && top.length > 0 && (
        <ol className="flex flex-col gap-3">
          {top.map(({ uid, nom, count, rank }) => (
            <li key={uid} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">{MEDAL[rank - 1]}</span>
              <span className="flex-1 text-sm font-medium text-gray-700 truncate">{nom}</span>
              <span className="text-sm font-bold text-brand-700 bg-brand-50 rounded-full px-3 py-0.5">
                {count} membre{count > 1 ? "s" : ""}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
