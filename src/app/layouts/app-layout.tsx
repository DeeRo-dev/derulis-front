import { AppHeader } from "@/components/layout/app-header";
import { PageTransition } from "@/components/layout/page-transition";

export function AppLayout() {
  return (
    <div className="min-h-svh bg-lilac-50">
      <AppHeader />

      <main className="mx-auto w-full max-w-md px-5 pb-12">
        <PageTransition />
      </main>
    </div>
  );
}
