import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import MenuOptionList from "./components/MenuOptionList";

// Angular's menu-options module only routes the search screen (menu-options-routing.module.ts
// has a single '' route) — create/edit happens through the NewEditMenuOptionDialogComponent
// opened from that screen, so MenuOptionForm is rendered as a dialog from MenuOptionList and is
// intentionally not routed here.
export const menuOptionsRoutes: RouteObject[] = [
  {
    path: '/menu-options',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MenuOptionList />,
      },
      {
        path: 'list',
        element: <MenuOptionList />,
      },
    ]
  },
];
