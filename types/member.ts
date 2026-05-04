export type Genre = "Homme" | "Femme";

export type SituationMatrimoniale =
  | "Célibataire"
  | "Marié(e)"
  | "Divorcé(e)"
  | "Veuf/Veuve";

export interface Member {
  id: string;
  nom: string;
  postNom: string;
  prenom: string;
  genre: Genre;
  situationMatrimoniale: SituationMatrimoniale;
  telephone: string;
  avenue: string;
  quartier: string;
  commune: string;
  commentaire?: string;
  createdAt: string;
  updatedAt: string;
}

export type MemberInput = Omit<Member, "id" | "createdAt" | "updatedAt">;
