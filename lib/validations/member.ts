import { z } from "zod";

export const memberSchema = z.object({
  nom: z.string().min(1, "Nom requis").max(50),
  postNom: z.string().min(1, "Post-nom requis").max(50),
  prenom: z.string().min(1, "Prénom requis").max(50),
  genre: z.enum(["Homme", "Femme"], { required_error: "Genre requis" }),
  situationMatrimoniale: z.enum(
    ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf/Veuve"],
    { required_error: "Situation matrimoniale requise" }
  ),
  telephone: z
    .string()
    .min(9, "Téléphone invalide")
    .max(15)
    .regex(/^[0-9+\s\-()]+$/, "Format téléphone invalide"),
  avenue: z.string().min(1, "Avenue requise").max(100),
  quartier: z.string().min(1, "Quartier requis").max(100),
  commune: z.string().min(1, "Commune requise").max(100),
  commentaire: z.string().max(500).optional().or(z.literal("")),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
