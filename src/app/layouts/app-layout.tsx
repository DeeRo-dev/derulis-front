import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function AppLayout() {
  return (
    <div className="min-h-svh bg-lilac-50">
      <AppHeader />

      {/* pb-28 deja lugar para la nav fija sin que tape el contenido. */}
      <main className="mx-auto w-full max-w-md px-5 pb-28">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
