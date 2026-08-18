import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cropToFile } from "@/lib/crop-image";

/**
 * Elegir qué parte de la foto queda.
 *
 * Existe porque `object-cover` recorta por el centro, y en una foto donde
 * la persona no está en el medio eso corta justo lo que importa.
 */
/**
 * El encuadre en sí. Va aparte y con `key` por archivo: al elegir otra foto
 * el componente se remonta y el zoom y la posición arrancan de cero solos,
 * sin un efecto que los resetee a mano.
 */
function CropperBody({
  file,
  aspect,
  round,
  onDone,
  onCancel,
}: {
  file: File;
  aspect: number;
  round?: boolean;
  onDone: (file: File) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  /*
   * El object URL se crea acá y no en el inicializador de `useState` por
   * StrictMode: en desarrollo React monta, desmonta y vuelve a montar, la
   * limpieza revoca la URL y un valor de inicializador no se recalcula al
   * remontar — el recorte quedaba en negro. Creándola en el efecto, el
   * remonte genera una nueva.
   *
   * eslint-disable: la regla apunta a evitar renders en cascada por estado
   * derivado. Esto no es estado derivado, es el ciclo de vida de un recurso
   * del navegador que hay que liberar a mano; sin `setState` no habría
   * forma de mostrarlo.
   */
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);

    // Sin esto, cada foto elegida queda en memoria hasta recargar la página.
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const confirm = async () => {
    if (!area) return;

    setWorking(true);
    try {
      onDone(await cropToFile(file, area));
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <div className="relative h-72 w-full bg-foreground/90">
        {preview ? (
          <Cropper
            image={preview}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={round ? "round" : "rect"}
            showGrid={!round}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_area, pixels) => setArea(pixels)}
          />
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <FiZoomOut
            className="h-4 w-4 shrink-0 text-muted"
            aria-hidden="true"
          />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            aria-label="Zoom"
            onChange={(event) => setZoom(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-lilac-200 accent-primary"
          />
          <FiZoomIn className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="flex-1"
            disabled={working || area === null}
            onClick={() => void confirm()}
          >
            {working ? "Recortando…" : "Usar esta foto"}
          </Button>
        </div>
      </div>
    </>
  );
}

export function ImageCropper({
  file,
  aspect,
  round,
  onDone,
  onCancel,
}: {
  /** La imagen elegida. `null` cierra el panel. */
  file: File | null;
  /** 1 para avatar, 16/9 para una portada. */
  aspect: number;
  /** Marco circular: para avatares, así se ve el recorte real. */
  round?: boolean;
  onDone: (file: File) => void;
  onCancel: () => void;
}) {
  return (
    <Sheet
      open={file !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-3xl border-t-0 bg-white"
      >
        <SheetHeader className="p-5 pb-3">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Acomodá la foto
          </SheetTitle>
          <SheetDescription>
            Arrastrá para mover y usá el zoom. Lo que quede en el marco es lo
            que se guarda.
          </SheetDescription>
        </SheetHeader>

        {file ? (
          <CropperBody
            /* La clave remonta el recorte al cambiar de foto: zoom y
               posición vuelven a cero sin sincronizar nada a mano. */
            key={`${file.name}-${file.size}-${file.lastModified}`}
            file={file}
            aspect={aspect}
            round={round}
            onDone={onDone}
            onCancel={onCancel}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
