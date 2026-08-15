import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiShare2, FiCheck, FiMapPin, FiInstagram } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailTopBar } from "@/components/layout/detail-top-bar";
import { isNotFound } from "@/lib/apiClient";
import { usePlaceReviews } from "../hooks/use-places";
import { PlaceScore } from "../components/place-score";
import { TableReviewCard } from "../components/table-review-card";

function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
        // Cancelar no es un error que valga la pena mostrar.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      aria-label={copied ? "Copiado" : "Compartir lugar"}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-lilac-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {copied ? (
        <FiCheck className="h-5 w-5" aria-hidden="true" />
      ) : (
        <FiShare2 className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

export function PlaceDetailPage() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const { data, isPending, isError, error } = usePlaceReviews(Number(placeId));

  if (isPending) {
    return (
      <section>
        <DetailTopBar />
        <div className="mt-6 space-y-4">
          <Skeleton className="mx-auto h-36 w-36 rounded-full" />
          <Skeleton className="mx-auto h-4 w-40" />
          <Skeleton className="mt-6 h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <DetailTopBar />
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isNotFound(error) ? "Lugar no encontrado" : "No pudimos cargarlo"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isNotFound(error)
              ? "Puede que lo hayan borrado o que el enlace esté mal."
              : "Revisá tu conexión y volvé a intentar."}
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate("/discover")}
          >
            Ir a Descubrir
          </Button>
        </div>
      </section>
    );
  }

  const { place, derulis, visitCount, tables } = data;

  return (
    <section>
      <DetailTopBar>
        <ShareButton name={place.name} />
      </DetailTopBar>

      <h1 className="text-center text-2xl font-bold tracking-tight text-primary">
        {place.name}
      </h1>

      <div className="mt-2 flex flex-col items-center gap-1 text-sm text-muted">
        <p className="flex items-center gap-1.5">
          <FiMapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {place.address}
        </p>
        {place.instagram ? (
          <a
            href={`https://instagram.com/${place.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <FiInstagram className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            @{place.instagram}
          </a>
        ) : null}
      </div>

      <PlaceScore derulis={derulis} visitCount={visitCount} />

      {tables.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-lilac-200/50">
          <p className="font-semibold text-foreground">Todavía sin reseñas</p>
          <p className="mt-1 text-sm text-muted">
            Cuando una mesa lo visite y puntúe, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {tables.map((review) => (
            <TableReviewCard key={review.outingId} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}
