import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import Profile from "./components/Profile";

export const usersRoutes: RouteObject[] = [
  {
    path: '/users',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <UserList />,
      },
      {
        path: 'list',
        element: <UserList />,
      },
      {
        path: 'new',
        element: <UserForm />,
      },
      {
        path: 'edit/:id',
        element: <UserForm />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ]
  },
];
