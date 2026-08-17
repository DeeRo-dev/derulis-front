import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/public-layout";
import { AppShell } from "../layouts/app-shell";
import { AppLayout } from "../layouts/app-layout";
import { DetailLayout } from "../layouts/detail-layout";
import { MapLayout } from "../layouts/map-layout";
import { GuestRoute, ProtectedRoute } from "./route-guards";
import { ComingSoon } from "@/components/layout/coming-soon";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { DiscoverPage } from "@/features/discover/pages/discover-page";
import { SearchPage } from "@/features/discover/pages/search-page";
import { JoinTablePage } from "@/features/tables/pages/join-table-page";
import { NewOutingPage } from "@/features/tables/pages/new-outing-page";
import { TablesPage } from "@/features/tables/pages/tables-page";
import { NewTablePage } from "@/features/tables/pages/new-table-page";
import { TableDetailPage } from "@/features/tables/pages/table-detail-page";
import { PlaceDetailPage } from "@/features/places/pages/place-detail-page";
import { ReviewOutingPage } from "@/features/reviews/pages/review-outing-page";
import { ProfilePage } from "@/features/profile/pages/profile-page";

export const appRouter = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="/discover" replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        // El sidebar es común a todas las pantallas con sesión iniciada.
        element: <AppShell />,
        children: [
      {
        // Pantallas de sección: con cabecera global.
        element: <AppLayout />,
        children: [
          { path: "discover", element: <DiscoverPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "tables", element: <TablesPage /> },
          {
            path: "reviews",
            element: (
              <ComingSoon
                title="Mis Reseñas"
                description="Todo lo que puntuaste, junto y ordenado por fecha."
              />
            ),
          },
          {
            path: "favorites",
            element: (
              <ComingSoon
                title="Favoritos"
                description="Los lugares que guardaste para volver."
              />
            ),
          },
        ],
      },
      {
        // El mapa ocupa toda la pantalla: sin cabecera ni padding.
        element: <MapLayout />,
        children: [{ path: "search", element: <SearchPage /> }],
      },
      {
        // Pantallas de detalle: cada una trae su propia barra superior.
        element: <DetailLayout />,
        children: [
          { path: "tables/new", element: <NewTablePage /> },
          { path: "tables/join", element: <JoinTablePage /> },
          { path: "tables/:tableId", element: <TableDetailPage /> },
          { path: "places/:placeId", element: <PlaceDetailPage /> },
          { path: "outings/:outingId/review", element: <ReviewOutingPage /> },
          {
            path: "tables/:tableId/invite",
            element: (
              <ComingSoon
                title="Invitar comensales"
                description="Buscá usuarios por nombre o email y sumalos a la mesa."
              />
            ),
          },
          {
            path: "tables/:tableId/visits",
            element: (
              <ComingSoon
                title="Visitas de la mesa"
                description="El historial completo con lo puntuado y lo gastado en cada salida."
              />
            ),
          },
          {
            path: "tables/:tableId/outings/new",
            element: <NewOutingPage />,
          },
        ],
      },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
