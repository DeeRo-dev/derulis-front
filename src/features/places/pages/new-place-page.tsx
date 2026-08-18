import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLink, FiMapPin, FiPhone, FiSave, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { TextArea } from "@/components/ui/text-area";
import { ImagePicker } from "@/components/ui/image-picker";
import { LocationPicker } from "@/components/ui/location-picker";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { FormError } from "@/features/auth/components/form-error";
import { getApiErrorMessage } from "@/lib/apiClient";
import { useCreatePlace } from "../hooks/use-create-place";
import { toInstagramHandle } from "../lib/instagram";
import { newPlaceSchema, type NewPlaceValues } from "../lib/schemas";

/**
 * Alta de un lugar por sí sola, sin salida de por medio.
 *
 * Antes un lugar solo nacía al agendar una cita con una mesa, y eso obligaba
 * a tener mesa y fecha para dejar registrado un restaurante que descubriste.
 * Acá se carga la ficha y listo; la visita se agenda después, desde su
 * pantalla.
 */
export function NewPlacePage() {
  const navigate = useNavigate();
  const createPlace = useCreatePlace();

  /* La foto no viaja en el formulario: el endpoint de imágenes necesita el
     id del lugar, que recién existe una vez guardado. Se elige acá y se
     sube después (ver `useCreatePlace`). */
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /*
   * El object URL se crea en el efecto y no en un inicializador de estado:
   * hay que revocarlo a mano al cambiar de foto o al desmontar, o cada
   * imagen elegida queda en memoria hasta recargar la página.
   *
   * eslint-disable: la regla apunta a estado derivado que dispara renders
   * en cascada. Esto es el ciclo de vida de un recurso del navegador.
   */
  useEffect(() => {
    if (!photo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<NewPlaceValues>({
    resolver: zodResolver(newPlaceSchema),
    defaultValues: {
      name: "",
      description: "",
      instagram: "",
      address: "",
      city: "",
      province: "",
      phone: "",
    },
  });

  /* `useWatch` y no `watch()`: este último devuelve una función nueva en
     cada render y deja al compilador de React sin poder memoizar nada de
     la pantalla. */
  const description = useWatch({ control, name: "description" });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  const onSubmit = (values: NewPlaceValues) =>
    createPlace.mutate({
      name: values.name,
      address: values.address,
      // El backend guarda null si no viene: mandar "" ensucia la ficha.
      description: values.description || undefined,
      phone: values.phone || undefined,
      instagram: toInstagramHandle(values.instagram),
      city: values.city || undefined,
      province: values.province || undefined,
      latitude: values.latitude,
      longitude: values.longitude,
      photo,
    });

  return (
    <section>
      <DetailTopBar />

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        Nuevo Restaurante
      </h1>
      <p className="mt-2 text-base leading-6 text-muted">
        Añadí los detalles del lugar para que otros puedan descubrirlo.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {createPlace.isError ? (
          <FormError
            message={getApiErrorMessage(
              createPlace.error,
              "No pudimos registrar el lugar. Probá de nuevo.",
            )}
          />
        ) : null}

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-foreground">
            Foto del restaurante
          </span>
          <ImagePicker
            variant="dropzone"
            label="Tocá para subir una foto"
            hint="Formatos recomendados: JPG, PNG o WEBP. Máx 5 MB."
            preview={preview}
            /* La foto principal se muestra apaisada y recortada: sin esto,
               una foto vertical pierde la mitad sin que nadie lo elija. */
            crop={{ aspect: 16 / 10 }}
            onPick={setPhoto}
          />
        </div>

        <TextField
          label="Nombre del restaurante *"
          placeholder="Ej. El Buen Sabor"
          maxLength={120}
          autoFocus
          icon={<FiShoppingBag className="h-5 w-5" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <TextArea
          label="Descripción"
          placeholder="¿Qué hace especial a este lugar?"
          maxLength={500}
          count={description?.length ?? 0}
          error={errors.description?.message}
          {...register("description")}
        />

        <TextField
          label="Instagram"
          placeholder="@usuario_restaurante"
          hint="Opcional. Podés pegar el link completo."
          icon={<FiLink className="h-5 w-5" />}
          error={errors.instagram?.message}
          {...register("instagram")}
        />

        <TextField
          label="Dirección completa"
          placeholder="Ej. Calle Principal 123, Ciudad"
          maxLength={200}
          icon={<FiMapPin className="h-5 w-5" />}
          error={errors.address?.message}
          {...register("address")}
        />

        {/* Ciudad y provincia habilitan los filtros por zona del buscador. */}
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Ciudad"
            placeholder="Buenos Aires"
            maxLength={120}
            error={errors.city?.message}
            {...register("city")}
          />
          <TextField
            label="Provincia"
            placeholder="CABA"
            maxLength={120}
            error={errors.province?.message}
            {...register("province")}
          />
        </div>

        <TextField
          label="Teléfono (opcional)"
          type="tel"
          inputMode="tel"
          placeholder="+54 11 5555 5555"
          maxLength={30}
          icon={<FiPhone className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <LocationPicker
          latitude={latitude ?? null}
          longitude={longitude ?? null}
          error={errors.latitude?.message ?? errors.longitude?.message}
          onPick={(lat, lng) => {
            /* `shouldValidate` no alcanza: hasta que no están las dos
               coordenadas el esquema sigue fallando, y el error volvería a
               aparecer entre un `setValue` y el otro. */
            setValue("latitude", lat);
            setValue("longitude", lng);
            clearErrors(["latitude", "longitude"]);
          }}
        />

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            className="w-full"
            disabled={createPlace.isPending}
          >
            <FiSave className="h-5 w-5" aria-hidden="true" />
            {createPlace.isPending ? "Guardando…" : "Guardar restaurante"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
