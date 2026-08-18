/** Región del original a conservar, en píxeles. La que devuelve el cropper. */
export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Los tipos que acepta el backend. Fuera de esos, se guarda como JPEG. */
const KEEPABLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Lado máximo del resultado. Un avatar se muestra a 96px como mucho, así que
 * 1024 alcanza de sobra incluso en pantallas de alta densidad, y evita
 * guardar los 4000px que manda un celular moderno.
 */
const MAX_SIDE = 1024;

/**
 * Recorta la imagen y devuelve un archivo listo para subir.
 *
 * Se recorta en el cliente en vez de guardar el encuadre como dato porque
 * el avatar se muestra en media docena de lugares distintos: si el recorte
 * viviera en un campo, cada uno tendría que acordarse de aplicarlo. Con la
 * imagen ya recortada, sale bien en todos sin código extra.
 */
export async function cropToFile(
  file: File,
  area: CropArea,
  fileName = "recorte",
): Promise<File> {
  /* `imageOrientation: "from-image"` aplica la orientación EXIF. Sin esto,
     las fotos sacadas con el celular de costado salen rotadas 90°. */
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });

  const scale = Math.min(1, MAX_SIDE / Math.max(area.width, area.height));
  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo preparar el recorte");

  // Sin esto, achicar una foto grande deja bordes dentados.
  context.imageSmoothingQuality = "high";

  context.drawImage(
    bitmap,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height,
  );
  bitmap.close();

  const type = KEEPABLE.includes(file.type) ? file.type : "image/jpeg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, 0.92),
  );

  if (!blob) throw new Error("No se pudo generar el recorte");

  const extension = type.split("/")[1];
  return new File([blob], `${fileName}.${extension}`, { type });
}
