import { z } from "zod";

export const memberSchema = z.object({
  nom: z.string().min(1, "Nom requis").max(100),
  postNom: z.string().max(50).optional(),
  prenom: z.string().max(50).optional(),
  genre: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["Homme", "Femme"]).optional()
  ),
  situationMatrimoniale: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum(["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf/Veuve"]).optional()
  ),
  telephone: z
    .string()
    .min(9, "Téléphone invalide")
    .max(15)
    .regex(/^[0-9+\s\-()]+$/, "Format téléphone invalide"),
  avenue: z.string().max(100).optional(),
  quartier: z.string().max(100).optional(),
  commune: z.string().max(100).optional(),
  commentaire: z.string().max(500).optional().or(z.literal("")),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
