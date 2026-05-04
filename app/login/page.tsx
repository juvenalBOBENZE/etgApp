"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/firebase/firebaseAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import Image from "next/image";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  async function onSubmit(data: LoginForm) {
    setError("");
    try {
      await signIn(data.email, data.password);
      toast.success("Connexion réussie");
      router.push("/dashboard");
    } catch {
      setError("Email ou mot de passe incorrect");
    }
  }

  return (
    <main className="min-h-screen bg-brand-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
            <Image src="/logo.png" alt="ETG Logo" width={80} height={80} className="object-cover" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Église</p>
            <h1 className="text-xl font-bold text-brand-700">Terre de Grâce</h1>
            <p className="text-sm text-gray-500 mt-1">Gestion des membres</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="admin@etg.org"
            error={errors.email?.message}
            required
            autoComplete="email"
            {...register("email")}
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            autoComplete="current-password"
            {...register("password")}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-1">
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </main>
  );
}
