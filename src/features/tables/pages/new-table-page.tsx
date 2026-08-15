import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUsers } from "react-icons/fi";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextArea } from "@/components/ui/text-area";
import { FormError } from "@/features/auth/components/form-error";
import { getApiErrorMessage } from "@/lib/apiClient";
import { useCreateTable } from "../hooks/use-tables";
import {
  createTableSchema,
  DESCRIPTION_MAX,
  NAME_MAX,
  type CreateTableValues,
} from "../lib/schemas";

export function NewTablePage() {
  const createTable = useCreateTable();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTableValues>({
    resolver: zodResolver(createTableSchema),
    defaultValues: { name: "", description: "" },
  });

  const description = useWatch({ control, name: "description" });

  const onSubmit = (values: CreateTableValues) => createTable.mutate(values);

  return (
    <section>
      <DetailTopBar />

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        Nueva mesa
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Ponele un nombre para reconocerla y contá de qué se trata. Después
        invitás comensales, o la dejás para vos solo.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {createTable.isError ? (
          <FormError
            message={getApiErrorMessage(
              createTable.error,
              "No pudimos crear la mesa. Probá de nuevo.",
            )}
          />
        ) : null}

        <TextField
          label="Nombre de la mesa"
          placeholder="Sushi del viernes"
          maxLength={NAME_MAX}
          autoFocus
          error={errors.name?.message}
          {...register("name")}
        />

        <TextArea
          label="Descripción"
          placeholder="Contá qué van a comer, la ocasión o lo que quieran probar."
          maxLength={DESCRIPTION_MAX}
          count={description.length}
          hint="Opcional"
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="flex items-start gap-2 rounded-xl bg-lilac-100 px-4 py-3 text-sm text-lilac-700">
          <FiUsers className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Vas a poder invitar comensales en el paso siguiente. También podés
            usar la mesa vos solo.
          </span>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createTable.isPending}
        >
          {createTable.isPending ? "Creando mesa…" : "Crear mesa"}
        </Button>
      </form>
    </section>
  );
}
