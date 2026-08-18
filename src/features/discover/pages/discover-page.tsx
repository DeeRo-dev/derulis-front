import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { PlaceSearch } from "../components/place-search";
import { TopPlaces } from "../components/top-places";
import { NewPlaceFab } from "@/features/places/components/new-place-fab";
import { itemVariants, listVariants } from "@/lib/motion";

/**
 * El home es solo descubrimiento: buscar y ver lo mejor puntuado. Armar una
 * mesa y las mesas activas viven en /tables, a un toque desde el menú.
 */
export function DiscoverPage() {
  const user = useCurrentUser();
  const firstName = user?.name?.split(" ")[0];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  return (
    <motion.div variants={listVariants} initial="initial" animate="animate">
      <motion.h1 variants={itemVariants} className="pt-2 text-sm text-muted">
        {firstName ? `Hola, ${firstName}` : "Hola"}
      </motion.h1>

      <motion.section variants={itemVariants} className="mt-6">
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
      </motion.section>

      {/* pb-24: el botón flotante no puede tapar el final del listado. */}
      <motion.div variants={itemVariants} className="pb-24">
        <TopPlaces search={search} page={page} onPageChange={setPage} />
      </motion.div>

      <NewPlaceFab />
    </motion.div>
  );
}
