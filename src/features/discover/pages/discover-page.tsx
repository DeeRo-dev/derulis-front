import { useState } from "react";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { CreateTableCard } from "../components/create-table-card";
import { ActiveTables } from "../components/active-tables";
import { PlaceSearch } from "../components/place-search";
import { TopPlaces } from "../components/top-places";

export function DiscoverPage() {
  const user = useCurrentUser();
  const firstName = user?.name?.split(" ")[0];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <>
      <h1 className="pt-2 text-sm text-muted">
        {firstName ? `Hola, ${firstName}` : "Hola"}
      </h1>

      <div className="mt-3">
        <CreateTableCard />
      </div>

      <ActiveTables />

      <section className="mt-10">
        <h2 className="text-center text-base font-medium text-muted">
          Descubrí nuevos sabores cerca tuyo
        </h2>

        <PlaceSearch
          value={search}
          onSearch={(term) => {
            setSearch(term);
            // Buscar algo nuevo tiene que arrancar en la primera página.
            setPage(1);
          }}
        />
      </section>

      <TopPlaces search={search} page={page} onPageChange={setPage} />
    </>
  );
}
