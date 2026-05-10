import * as XLSX from "xlsx";
import type { Member } from "@/types/member";
import type { MemberFormValues } from "@/lib/validations/member";
import { memberSchema } from "@/lib/validations/member";

const HEADERS: Record<string, keyof MemberFormValues | "createdAt"> = {
  "Nom": "nom",
  "Post-nom": "postNom",
  "Prénom": "prenom",
  "Genre": "genre",
  "Situation Matrimoniale": "situationMatrimoniale",
  "Téléphone": "telephone",
  "Avenue": "avenue",
  "Quartier": "quartier",
  "Commune": "commune",
  "Commentaire": "commentaire",
};

export function exportMembersToExcel(members: Member[]): void {
  const rows = members.map((m) => ({
    "Nom": m.nom,
    "Post-nom": m.postNom,
    "Prénom": m.prenom,
    "Genre": m.genre,
    "Situation Matrimoniale": m.situationMatrimoniale,
    "Téléphone": m.telephone,
    "Avenue": m.avenue,
    "Quartier": m.quartier,
    "Commune": m.commune,
    "Commentaire": m.commentaire ?? "",
    "Date d'ajout": m.createdAt ? new Date(m.createdAt).toLocaleDateString("fr-FR") : "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 },
    { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 18 },
    { wch: 16 }, { wch: 30 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Membres");
  XLSX.writeFile(wb, `membres_etg_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportTemplateExcel(): void {
  const ws = XLSX.utils.json_to_sheet([{
    "Nom": "BOBENZE",
    "Post-nom": "Juvenal",
    "Prénom": "Joseph",
    "Genre": "Homme",
    "Situation Matrimoniale": "Célibataire",
    "Téléphone": "+243810000000",
    "Avenue": "Avenue de la Paix",
    "Quartier": "Résidentiel",
    "Commune": "Gombe",
    "Commentaire": "",
  }]);

  ws["!cols"] = [
    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 },
    { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 18 },
    { wch: 16 }, { wch: 30 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Membres");
  XLSX.writeFile(wb, "modele_import_membres.xlsx");
}

export interface ImportResult {
  success: number;
  errors: { row: number; message: string }[];
  data: MemberFormValues[];
}

export async function parseExcelFile(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

  const data: MemberFormValues[] = [];
  const errors: { row: number; message: string }[] = [];

  rows.forEach((row, i) => {
    const raw: Record<string, unknown> = {};
    for (const [header, field] of Object.entries(HEADERS)) {
      if (field !== "createdAt") {
        raw[field] = row[header] !== undefined ? String(row[header]).trim() : "";
      }
    }

    const result = memberSchema.safeParse(raw);
    if (result.success) {
      data.push(result.data);
    } else {
      const msg = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      errors.push({ row: i + 2, message: msg });
    }
  });

  return { success: data.length, errors, data };
}
