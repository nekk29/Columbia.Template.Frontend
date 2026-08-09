/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";
import type { ToastStatus } from "@/components/shared/ToastMessage";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { DialogProps } from "@/components/shared/AlertMessageDialog";

export interface ConfirmationDialogProps extends DialogProps {
  onYes: (data: any) => void,
  onNo?: (data: any) => void,
}

export interface SaveCancelDialogProps extends DialogProps {
  onSave: (data: any) => void,
  onCancel?: (data: any) => void,
  renderContent: (data: any) => React.ReactNode,
}

export interface DialogsContextProps {
  openToast: (status: ToastStatus, description: string, title?: string) => void;
  openInfoToast: (description: string, title?: string) => void;
  openSuccessToast: (description: string, title?: string) => void;
  openWarningToast: (description: string, title?: string) => void;
  openErrorToast: (description: string, title?: string) => void;
  openToasts: (response: ResponseBaseDto) => void;
  openConfirmationDialog: (props: ConfirmationDialogProps) => void;
  openSaveCancelDialog: (props: SaveCancelDialogProps) => void;
}

export const DialogsContext = createContext<DialogsContextProps>({
  openToast: (): void => { },
  openInfoToast: (): void => { },
  openSuccessToast: (): void => { },
  openWarningToast: (): void => { },
  openErrorToast: (): void => { },
  openToasts: (): void => { },
  openConfirmationDialog: (): void => { },
  openSaveCancelDialog: (): void => { },
});
