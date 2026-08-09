import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import SettingsList from "./components/SettingsList";
import SettingsForm from "./components/SettingsForm";

export const settingsRoutes: RouteObject[] = [
  {
    path: '/settings',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <SettingsList />,
      },
      {
        path: 'list',
        element: <SettingsList />,
      },
      {
        path: 'edit/:group/:code',
        element: <SettingsForm />,
      },
    ],
  },
];
