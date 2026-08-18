import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { getApiErrorMessage } from "@/lib/apiClient";
import { AuthCard } from "../components/auth-card";
import { FormError } from "../components/form-error";
import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginValues } from "../lib/schemas";

export function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => login.mutate(values);

  return (
    <AuthCard
      title="Bienvenido de vuelta"
      description="Iniciá sesión para continuar en Derulis."
      footerText="¿No tenés cuenta?"
      footerLinkLabel="Registrate"
      footerLinkTo="/register"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {login.isError ? (
          <FormError
            message={getApiErrorMessage(
              login.error,
              "No pudimos iniciar sesión. Probá de nuevo.",
            )}
          />
        ) : null}

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
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<FiLock className="h-5 w-5" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            to="/recuperar"
            className="text-sm font-bold text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="mt-2 h-14 w-full shadow-lg shadow-primary/30"
          disabled={login.isPending}>
          {login.isPending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </AuthCard>
  );
}
