import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateName } from "../hooks/use-profile";
import { editNameSchema, type EditNameValues } from "../lib/schemas";

export function EditNameSheet({
  currentName,
  open,
  onOpenChange,
}: {
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateName = useUpdateName();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditNameValues>({
    resolver: zodResolver(editNameSchema),
    defaultValues: { name: currentName },
  });

  /* El panel no se desmonta al cerrarse, así que sin esto la próxima vez
     que se abra mostraría lo último que se tipeó y no el nombre real. */
  useEffect(() => {
    if (open) reset({ name: currentName });
  }, [open, currentName, reset]);

  const onSubmit = (values: EditNameValues) =>
    updateName.mutate(values.name, { onSuccess: () => onOpenChange(false) });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-white">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Tu nombre
          </SheetTitle>
          <SheetDescription>
            Es el que ven tus mesas en las reseñas y en las invitaciones.
          </SheetDescription>
        </SheetHeader>

        <form className="space-y-5 p-5 pt-3" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nombre"
            autoComplete="name"
            maxLength={80}
            icon={<FiUser className="h-5 w-5" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Button type="submit" className="w-full" disabled={updateName.isPending}>
            {updateName.isPending ? "Guardando…" : "Guardar"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
