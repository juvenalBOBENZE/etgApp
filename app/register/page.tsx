"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerVisiteur } from "@/lib/firebase/firebaseAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

const schema = z.object({
  nom: z.string().min(2, "Nom requis"),
  telephone: z
    .string()
    .min(8, "Numéro invalide")
    .regex(/^\+?\d+$/, "Format invalide (ex: +243812810541)"),
  password: z.string().min(6, "Mot de passe requis (6 caractères min)"),
  confirmPassword: z.string().min(6, "Confirmez le mot de passe"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: RegisterForm) {
    setError("");
    try {
      await registerVisiteur(data.nom, data.telephone, data.password);
      toast.success("Compte créé avec succès");
      router.push("/visiteur");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === "auth/email-already-in-use") {
        setError("Ce numéro est déjà enregistré");
      } else {
        setError("Erreur lors de la création du compte");
      }
    }
  }

  return (
    <main className="min-h-screen bg-brand-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <Image src="/logo.png" alt="ETG Logo" width={80} height={80} className="object-cover" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Église</p>
            <h1 className="text-xl font-bold text-brand-700">Terre de Grâce</h1>
            <p className="text-sm text-gray-500 mt-1">Créer un compte membre</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="nom"
            type="text"
            label="Nom complet"
            placeholder="Jean Dupont"
            error={errors.nom?.message}
            required
            autoComplete="name"
            {...register("nom")}
          />
          <Input
            id="telephone"
            type="tel"
            label="Numéro de téléphone"
            placeholder="0821234567"
            error={errors.telephone?.message}
            required
            autoComplete="tel"
            {...register("telephone")}
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            autoComplete="new-password"
            {...register("password")}
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            required
            autoComplete="new-password"
            {...register("confirmPassword")}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
