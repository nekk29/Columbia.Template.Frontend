import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ApplicationList from "./components/ApplicationList";
import ApplicationForm from "./components/ApplicationForm";

export const applicationsRoutes: RouteObject[] = [
  {
    path: '/applications',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ApplicationList />,
      },
      {
        path: 'list',
        element: <ApplicationList />,
      },
      {
        path: 'new',
        element: <ApplicationForm />,
      },
      {
        path: 'edit/:id',
        element: <ApplicationForm />,
      },
    ]
  },
];
