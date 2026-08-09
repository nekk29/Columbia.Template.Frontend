// https://tailgrids.com/docs/components

"use client";

import "@/App.css";
import i18next from "i18next";

import { initReactI18next } from "react-i18next";
import { resources } from "@/core/i18n/i18n.config";
import { I18nService } from "@/core/i18n/i18n.service";

import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AuthService } from "@/core/auth/services/auth.service";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DialogsProvider } from "@/core/dialog/context/DialogsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/pages/home/Home";
import NotFound from "@/pages/error/NotFound";
import Login from "@/features/users/components/Login";
import Register from "@/features/users/components/Register";
import AppLayout from "@/components/layout/layout/AppLayout";

import { rolesRoutes } from "@/features/roles/rolesRoutes";
import { usersRoutes } from "@/features/users/usersRoutes";
import { modulesRoutes } from "@/features/modules/modulesRoutes";
import { settingsRoutes } from "@/features/settings/settingsRoutes";
import { menuOptionsRoutes } from "@/features/menu-options/menuOptionsRoutes";
import { applicationsRoutes } from "@/features/applications/applicationsRoutes";

const queryClient = new QueryClient();
const language = I18nService.getCurrentLanguage();

i18next
  .use(initReactI18next)
  .init({
    lng: language,
    resources: resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  const router = createBrowserRouter([
    {
      element: <PrivateRoute isAuthenticated={isAuthenticated} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              path: '/',
              element: <Home />,
            },
            {
              path: '/home',
              element: <Home />,
            },
            ...applicationsRoutes,
            ...modulesRoutes,
            ...menuOptionsRoutes,
            ...rolesRoutes,
            ...usersRoutes,
            ...settingsRoutes
          ],
        },
      ],
    },
    {
      path: '/user/login',
      element: <Login />,
    },
    {
      path: '/user/register',
      element: <Register />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <DialogsProvider>
        <RouterProvider router={router} />
      </DialogsProvider>
    </QueryClientProvider>
  );
}
