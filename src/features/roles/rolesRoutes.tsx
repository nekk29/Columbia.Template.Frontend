import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import RoleList from "./components/RoleList";
import RoleForm from "./components/RoleForm";

export const rolesRoutes: RouteObject[] = [
  {
    path: '/roles',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <RoleList />,
      },
      {
        path: 'list',
        element: <RoleList />,
      },
      {
        path: 'new',
        element: <RoleForm />,
      },
      {
        path: 'edit/:id',
        element: <RoleForm />,
      },
    ]
  },
];
