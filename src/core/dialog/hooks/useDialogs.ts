/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { DialogsContext } from "@/core/dialog/context/DialogsContext";

export function useDialogs() {
  const context = useContext(DialogsContext);

  if (!context) {
    throw new Error('usePermissions must be used within a DialogsProvider');
  }

  return context;
}
