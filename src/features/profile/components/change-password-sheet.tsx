import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FormError } from "@/features/auth/components/form-error";
import { getApiErrorMessage } from "@/lib/apiClient";
import { useChangePassword } from "../hooks/use-profile";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../lib/schemas";

const EMPTY = {
  currentPassword: "",
  newPassword: "",
  repeatPassword: "",
};

export function ChangePasswordSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const change = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  /* Vaciar al abrir no es cosmético: son contraseñas, no pueden quedar
     escritas en un panel que se cerró. */
  useEffect(() => {
    if (open) {
      reset(EMPTY);
      change.reset();
    }
    // `change` cambia de identidad en cada render de la mutación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset]);

  const onSubmit = (values: ChangePasswordValues) =>
    /* Solo los dos campos que el backend espera: manda uno de más y el
       ValidationPipe (`forbidNonWhitelisted`) rechaza el cuerpo entero. */
    change.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      { onSuccess: () => onOpenChange(false) },
    );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Cambiar contraseña
          </SheetTitle>
          <SheetDescription>
            Te pedimos la actual para confirmar que sos vos.
          </SheetDescription>
        </SheetHeader>

        <form
          className="space-y-5 overflow-y-auto p-5 pt-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {change.isError ? (
            <FormError
              message={getApiErrorMessage(
                change.error,
                "No pudimos cambiar la contraseña.",
              )}
            />
          ) : null}

          <TextField
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            icon={<FiLock className="h-5 w-5" />}
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <TextField
            label="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            icon={<FiLock className="h-5 w-5" />}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <TextField
            label="Repetir la nueva"
            type="password"
            autoComplete="new-password"
            icon={<FiLock className="h-5 w-5" />}
            error={errors.repeatPassword?.message}
            {...register("repeatPassword")}
          />

          <Button type="submit" className="w-full" disabled={change.isPending}>
            {change.isPending ? "Guardando…" : "Cambiar contraseña"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
