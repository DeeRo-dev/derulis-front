import { motion } from "framer-motion";
import { FiTrash2, FiImage } from "react-icons/fi";
import { ImagePicker } from "@/components/ui/image-picker";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePlaceImage,
  usePlaceImages,
  useUploadPlaceImage,
} from "@/features/images/hooks/use-images";
import { itemVariants, listVariants, tap } from "@/lib/motion";

/**
 * Galería del lugar.
 *
 * El botón de subir se muestra siempre: el permiso —haber visitado el
 * lugar— no se puede saber acá sin pedir el historial de salidas del
 * usuario. Si el backend lo rechaza, se explica con su propio mensaje.
 */
export function PlaceGallery({ placeId }: { placeId: number }) {
  const images = usePlaceImages(placeId);
  const upload = useUploadPlaceImage(placeId);
  const remove = useDeletePlaceImage(placeId);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Fotos
        </h2>

        <ImagePicker
          variant="outline"
          label="Subir foto"
          busy={upload.isPending}
          onPick={(file) => upload.mutate(file)}
        />
      </div>

      {/* Los errores los avisa el toast global: son acciones sueltas, no
          campos de un formulario que haya que corregir en su lugar. */}

      <div className="mt-4">
        {images.isPending ? (
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        ) : images.isError ? (
          <p className="text-sm text-muted">No pudimos cargar las fotos.</p>
        ) : images.data.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
            <FiImage
              className="mx-auto h-8 w-8 text-lilac-400"
              aria-hidden="true"
            />
            <p className="mt-3 font-semibold text-foreground">
              Todavía no hay fotos
            </p>
            <p className="mt-1 text-sm text-muted">
              Si fuiste, subí la tuya: es lo primero que mira el que no conoce
              el lugar.
            </p>
          </div>
        ) : (
          <motion.ul
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-3 gap-2"
          >
            {images.data.map((image) => (
              <motion.li
                key={image.id}
                variants={itemVariants}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-lilac-100"
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />

                {/* Siempre visible, no solo en hover: en celular no hay hover. */}
                <motion.button
                  type="button"
                  whileTap={tap}
                  onClick={() => remove.mutate(image.id)}
                  disabled={remove.isPending}
                  aria-label="Borrar foto"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted shadow backdrop-blur transition-colors hover:text-error disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
