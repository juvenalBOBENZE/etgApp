"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, MemberFormValues } from "@/lib/validations/member";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Member } from "@/types/member";

const GENRES = [
  { value: "Homme", label: "Homme" },
  { value: "Femme", label: "Femme" },
];

const SITUATIONS = [
  { value: "Célibataire", label: "Célibataire" },
  { value: "Marié(e)", label: "Marié(e)" },
  { value: "Divorcé(e)", label: "Divorcé(e)" },
  { value: "Veuf/Veuve", label: "Veuf/Veuve" },
];

interface MemberFormProps {
  defaultValues?: Member;
  onSubmit: (data: MemberFormValues) => Promise<void>;
  onCancel: () => void;
}

export function MemberForm({ defaultValues, onSubmit, onCancel }: MemberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: defaultValues
      ? {
          nom: defaultValues.nom,
          postNom: defaultValues.postNom,
          prenom: defaultValues.prenom,
          genre: defaultValues.genre,
          situationMatrimoniale: defaultValues.situationMatrimoniale,
          telephone: defaultValues.telephone,
          avenue: defaultValues.avenue,
          quartier: defaultValues.quartier,
          commune: defaultValues.commune,
          commentaire: defaultValues.commentaire ?? "",
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="nom"
          label="Nom"
          placeholder="BOBENZE"
          error={errors.nom?.message}
          required
          {...register("nom")}
        />
        <Input
          id="postNom"
          label="Post-nom"
          placeholder="Juvenal"
          error={errors.postNom?.message}
        
          {...register("postNom")}
        />
        <Input
          id="prenom"
          label="Prénom"
          placeholder="Joseph"
          error={errors.prenom?.message}
          required
          {...register("prenom")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="genre"
          label="Genre"
          options={GENRES}
          placeholder="Sélectionner..."
          error={errors.genre?.message}
          required
          {...register("genre")}
        />
        <Select
          id="situationMatrimoniale"
          label="Situation matrimoniale"
          options={SITUATIONS}
          placeholder="Sélectionner..."
          error={errors.situationMatrimoniale?.message}
          required
          {...register("situationMatrimoniale")}
        />
      </div>

      <Input
        id="telephone"
        label="Téléphone"
        placeholder="+243 81 000 0000"
        error={errors.telephone?.message}
        required
        {...register("telephone")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          id="avenue"
          label="Avenue"
          placeholder="Avenue de la Paix"
          error={errors.avenue?.message}
          
          {...register("avenue")}
        />
        <Input
          id="quartier"
          label="Quartier"
          placeholder="Quartier Résidentiel"
          error={errors.quartier?.message}
          
          {...register("quartier")}
        />
        <Input
          id="commune"
          label="Commune"
          placeholder="Gombe"
          error={errors.commune?.message}
          required
          {...register("commune")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="commentaire" className="text-sm font-medium text-gray-700">
          Commentaire <span className="text-gray-400">(optionnel)</span>
        </label>
        <textarea
          id="commentaire"
          rows={3}
          placeholder="Notes supplémentaires..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 resize-none"
          {...register("commentaire")}
        />
        {errors.commentaire && (
          <p className="text-xs text-red-500">{errors.commentaire.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : defaultValues ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
