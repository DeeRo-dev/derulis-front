import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import { CreateTableCard } from "../components/create-table-card";
import { ActiveTables } from "../components/active-tables";
import { RecentActivity } from "../components/recent-activity";

export function DiscoverPage() {
  const user = useCurrentUser();
  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <h1 className="pt-2 text-sm text-muted">
        {firstName ? `Hola, ${firstName}` : "Hola"}
      </h1>

      <div className="mt-3">
        <CreateTableCard />
      </div>

      <ActiveTables />
      <RecentActivity />
    </>
  );
}
