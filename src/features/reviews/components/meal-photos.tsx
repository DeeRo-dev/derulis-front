import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { ImagePicker } from "@/components/ui/image-picker";
import { FormError } from "@/features/auth/components/form-error";
import {
  useDeleteMealImage,
  useMealImages,
  useUploadMealImage,
} from "@/features/images/hooks/use-images";
import { getApiErrorMessage } from "@/lib/apiClient";
import { itemVariants, listVariants, tap } from "@/lib/motion";

/**
 * Fotos del plato dentro de la reseña.
 *
 * Cuelgan de la puntuación, así que hasta que no puntúes no hay dónde
 * guardarlas: el bloque lo dice en vez de ofrecer un botón que va a fallar.
 */
export function MealPhotos({
  mealId,
  rated,
}: {
  mealId: number;
  rated: boolean;
}) {
  const images = useMealImages(mealId, rated);
  const upload = useUploadMealImage(mealId);
  const remove = useDeleteMealImage(mealId);

  if (!rated) {
    return (
      <p className="mt-4 rounded-2xl bg-lilac-50 px-4 py-3 text-sm text-muted">
        Puntuá el plato y vas a poder sumarle fotos.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">Fotos</span>
        <ImagePicker
          variant="outline"
          label="Agregar"
          busy={upload.isPending}
          onPick={(file) => upload.mutate(file)}
        />
      </div>

      <FormError
        message={
          upload.isError
            ? getApiErrorMessage(upload.error, "No pudimos subir la foto.")
            : remove.isError
              ? getApiErrorMessage(remove.error, "No pudimos borrar la foto.")
              : null
        }
      />

      {images.data && images.data.length > 0 ? (
        <motion.ul
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
        >
          {images.data.map((image) => (
            <motion.li
              key={image.id}
              variants={itemVariants}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-lilac-100"
            >
              <img
                src={image.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <motion.button
                type="button"
                whileTap={tap}
                onClick={() => remove.mutate(image.id)}
                disabled={remove.isPending}
                aria-label="Borrar foto"
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-muted shadow backdrop-blur transition-colors hover:text-error disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <FiTrash2 className="h-3 w-3" aria-hidden="true" />
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      ) : null}
    </div>
  );
}
