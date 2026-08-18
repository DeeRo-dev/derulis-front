import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { getApiErrorMessage } from "@/lib/apiClient";
import { AuthCard } from "../components/auth-card";
import { FormError } from "../components/form-error";
import { useRegister } from "../hooks/use-auth";
import { registerSchema, type RegisterValues } from "../lib/schemas";

export function RegisterPage() {
  const signup = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: RegisterValues) => signup.mutate(values);

  return (
    <AuthCard
      title="Creá tu cuenta"
      description="Registrate para empezar a puntuar lo que comés."
      footerText="¿Ya tenés cuenta?"
      footerLinkLabel="Iniciá sesión"
      footerLinkTo="/login"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {signup.isError ? (
          <FormError
            message={getApiErrorMessage(
              signup.error,
              "No pudimos crear tu cuenta. Probá de nuevo.",
            )}
          />
        ) : null}

        <TextField
          label="Nombre"
          autoComplete="name"
          placeholder="Tu nombre"
          icon={<FiUser className="h-5 w-5" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="ejemplo@correo.com"
          icon={<FiMail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <TextField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={<FiLock className="h-5 w-5" />}
          hint="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="mt-2 h-14 w-full shadow-lg shadow-primary/30"
          disabled={signup.isPending}>
          {signup.isPending ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>
    </AuthCard>
  );
}
