"use client";
import { useRef, useState } from "react";
import { Download, Upload, FileDown, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { exportMembersToExcel, exportTemplateExcel, parseExcelFile, type ImportResult } from "@/lib/excel";
import { addMember } from "@/lib/firebase/members";
import type { Member } from "@/types/member";
import toast from "react-hot-toast";

interface ExcelActionsProps {
  members: Member[];
  onImportDone: () => void;
}

export function ExcelActions({ members, onImportDone }: ExcelActionsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  function handleExport() {
    if (members.length === 0) {
      toast.error("Aucun membre à exporter");
      return;
    }
    exportMembersToExcel(members);
    toast.success(`${members.length} membres exportés`);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setImporting(true);
    setResult(null);
    try {
      const parsed = await parseExcelFile(file);
      setResult(parsed);

      if (parsed.data.length === 0) {
        toast.error("Aucun membre valide trouvé dans le fichier");
        setImporting(false);
        return;
      }

      let done = 0;
      for (const member of parsed.data) {
        await addMember(member);
        done++;
      }

      toast.success(`${done} membres importés avec succès`);
      onImportDone();
    } catch {
      toast.error("Erreur lors de la lecture du fichier");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleExport}
          className="flex items-center gap-2 text-sm"
        >
          <Download size={15} />
          Exporter Excel
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => exportTemplateExcel()}
          className="flex items-center gap-2 text-sm"
        >
          <FileDown size={15} />
          Modèle
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="flex items-center gap-2 text-sm"
        >
          <Upload size={15} />
          {importing ? "Importation..." : "Importer Excel"}
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Résultat import */}
      {result && (
        <div className="rounded-lg border bg-gray-50 p-3 flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Résultat de l&apos;import</span>
            <button type="button" onClick={() => setResult(null)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>

          {result.success > 0 && (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={14} />
              <span>{result.success} membre{result.success > 1 ? "s" : ""} importé{result.success > 1 ? "s" : ""}</span>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={14} />
                <span>{result.errors.length} ligne{result.errors.length > 1 ? "s" : ""} ignorée{result.errors.length > 1 ? "s" : ""}</span>
              </div>
              <ul className="ml-5 text-xs text-red-500 space-y-0.5 max-h-24 overflow-y-auto">
                {result.errors.map(({ row, message }) => (
                  <li key={row}>Ligne {row}: {message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
