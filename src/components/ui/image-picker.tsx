import { useId, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { ImageCropper } from "@/components/ui/image-cropper";
import { IMAGE_ACCEPT, validateImage } from "@/features/images/api/images.api";

/**
 * Botón para elegir una imagen del dispositivo.
 *
 * Es un `<label>` sobre un input oculto y no un `<button>` que dispare un
 * click: así el teclado y los lectores de pantalla lo anuncian como lo que
 * es —un campo de archivo— sin que haya que reimplementar nada.
 *
 * Valida acá mismo antes de avisar al padre: no tiene sentido subir 5 MB
 * para que el servidor los rechace.
 */
export function ImagePicker({
  onPick,
  label,
  hint,
  disabled,
  busy,
  className,
  variant = "solid",
  preview,
  crop,
}: {
  onPick: (file: File) => void;
  label: string;
  /** Solo en `dropzone`: la línea chica debajo del texto. */
  hint?: string;
  disabled?: boolean;
  /** Subiendo: bloquea y muestra el estado. */
  busy?: boolean;
  className?: string;
  variant?: "solid" | "outline" | "ghost" | "dropzone";
  /** Solo en `dropzone`: qué se ve si ya hay una imagen elegida. */
  preview?: string | null;
  /**
   * Con esto, antes de subir se abre el recorte y `onPick` recibe la imagen
   * ya recortada. Sin esto, sube tal cual se eligió.
   */
  crop?: { aspect: number; round?: boolean };
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [toCrop, setToCrop] = useState<File | null>(null);

  const blocked = disabled || busy;
  const isDropzone = variant === "dropzone";

  const variants = {
    solid:
      "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-lilac-200/50",
    outline:
      "border border-lilac-300 bg-white text-primary hover:bg-lilac-50",
    ghost: "bg-white/95 text-primary shadow-lg backdrop-blur hover:bg-white",
    /* Área grande y punteada: en un formulario de alta la foto es un campo
       más, no una acción suelta, y con el borde punteado se lee como el
       hueco que hay que llenar. */
    dropzone:
      "relative h-44 w-full flex-col overflow-hidden rounded-2xl border-2 border-dashed border-lilac-300 bg-white text-primary hover:bg-lilac-50",
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-center justify-center text-sm font-semibold transition-colors",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
          isDropzone ? "text-center" : "inline-flex h-11 gap-2 rounded-full px-5",
          variants[variant],
          blocked && "pointer-events-none opacity-60",
        )}
      >
        {isDropzone && preview ? (
          <>
            <img
              src={preview}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Sin el velo, el texto se pierde sobre fotos claras. */}
            <span className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-2 text-white">
              {busy ? "Subiendo…" : "Tocá para cambiar la foto"}
            </span>
          </>
        ) : isDropzone ? (
          <>
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lilac-100"
            >
              <FiCamera className="h-5 w-5" />
            </span>
            <span className="mt-3 block">{busy ? "Subiendo…" : label}</span>
            {hint ? (
              <span className="mt-1 block px-6 text-xs font-normal text-muted">
                {hint}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <FiCamera className="h-4 w-4 shrink-0" aria-hidden="true" />
            {busy ? "Subiendo…" : label}
          </>
        )}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          disabled={blocked}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];

            /* El input se limpia siempre: si no, volver a elegir el mismo
               archivo no dispara `change` y parece que el botón no anda. */
            event.target.value = "";
            if (!file) return;

            const problem = validateImage(file);
            setError(problem);
            if (problem) return;

            if (crop) setToCrop(file);
            else onPick(file);
          }}
        />
      </label>

      {error ? (
        <p role="alert" className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      {crop ? (
        <ImageCropper
          file={toCrop}
          aspect={crop.aspect}
          round={crop.round}
          onCancel={() => setToCrop(null)}
          onDone={(cropped) => {
            setToCrop(null);
            onPick(cropped);
          }}
        />
      ) : null}
    </div>
  );
}
