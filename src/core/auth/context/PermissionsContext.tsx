import { createContext } from "react";

export interface PermissionsContextProps {
  permissions: string[];
}

export const PermissionsContext = createContext<PermissionsContextProps>({
  permissions: []
});
