import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ModuleList from "./components/ModuleList";
import ModuleForm from "./components/ModuleForm";

export const modulesRoutes: RouteObject[] = [
  {
    path: '/modules',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ModuleList />,
      },
      {
        path: 'list',
        element: <ModuleList />,
      },
      {
        path: 'new',
        element: <ModuleForm />,
      },
      {
        path: 'edit/:id',
        element: <ModuleForm />,
      },
    ]
  },
];
