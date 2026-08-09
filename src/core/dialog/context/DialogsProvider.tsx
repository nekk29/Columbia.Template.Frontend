/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Check } from "@tailgrids/icons";
import { useTranslation } from "react-i18next";
import { WindowDialog } from "@/components/shared/WindowDialog";
import { AlertMessageDialog, type DialogAction } from "@/components/shared/AlertMessageDialog";

import {
  DialogsContext,
  type ConfirmationDialogProps,
  type SaveCancelDialogProps,
} from "./DialogsContext";

import {
  ToastMessage,
  ToastMessages,
  type ToastStatus,
  type ToastMessageProps,
  type ToastMessagesProps,
} from "@/components/shared/ToastMessage";

import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

export function DialogsProvider({ children }: { children: React.ReactNode }) {
  const { t: translate } = useTranslation();

  const toastMode = "alert";
  const [toastProps, setToastProps] = useState<ToastMessageProps>();

  const openToast = (status: ToastStatus, description: string, title?: string): void => {
    const props: ToastMessageProps = {
      mode: toastMode,
      status,
      isOpen: true,
      description,
      title: title ?? translate("COMMON.ALERT_LEVEL.INFO"),
    };

    setToastProps({ ...props });

    setTimeout(() => {
      setToastProps({ ...props, isOpen: false });
    }, 2500);
  }

  const openInfoToast = (description: string, title?: string): void => {
    openToast("info", description, title ?? translate("COMMON.ALERT_LEVEL.INFO"));
  }

  const openSuccessToast = (description: string, title?: string): void => {
    openToast("success", description, title ?? translate("COMMON.ALERT_LEVEL.SUCCESS"));
  }

  const openWarningToast = (description: string, title?: string): void => {
    openToast("warning", description, title ?? translate("COMMON.ALERT_LEVEL.WARNING"));
  }

  const openErrorToast = (description: string, title?: string): void => {
    openToast("error", description, title ?? translate("COMMON.ALERT_LEVEL.ERROR"));
  }

  const [toastsProps, setToastsProps] = useState<ToastMessagesProps>();

  const openToasts = (response: ResponseBaseDto) => {
    if (response === null || response === undefined) return;

    const messages = (response?.messages ?? []).map((m) => {
      return {
        ...m,
        isVisible: true,
        messageTypeTitle:
          m.messageType == 0 ? translate("COMMON.ALERT_LEVEL.SUCCESS")
            : m.messageType == 1 ? translate("COMMON.ALERT_LEVEL.INFO")
              : m.messageType == 2 ? translate("COMMON.ALERT_LEVEL.WARNING")
                : m.messageType == 3 ? translate("COMMON.ALERT_LEVEL.ERROR")
                  : translate("COMMON.ALERT_LEVEL.INFO")
      };
    });

    const propsSet: ToastMessagesProps = {
      mode: toastMode,
      response: { ...response, messages },
    };

    setToastsProps(propsSet);

    messages.forEach((_, index) => {
      setTimeout(() => {
        setToastsProps((prev) => {
          if (!prev?.response?.messages) return prev;

          const updatedMessages = prev.response.messages.map((m, i) =>
            i === index ? { ...m, isVisible: false } : m
          );

          return {
            ...prev,
            response: {
              ...prev.response,
              messages: updatedMessages,
            },
          };
        });
      }, (index + 1) * 2500);
    });
  };


  const [confirmationIsOpen, setConfirmationIsOpen] = useState<boolean>(false);
  const [confirmationActions, setConfirmationActions] = useState<DialogAction[]>([]);
  const [confirmationProps, setConfirmationProps] = useState<ConfirmationDialogProps>();

  const openConfirmationDialog = (props: ConfirmationDialogProps): void => {
    setConfirmationActions([
      {
        label: translate('COMMON.ACTIONS.YES'),
        icon: <Check />,
        func: (data: any) => {
          if (props.onYes) props.onYes(data);
          setConfirmationIsOpen(false);
        },
      },
      {
        close: true,
        label: translate('COMMON.ACTIONS.NO'),
        func: (data: any) => {
          if (props.onNo) props.onNo(data);
          setConfirmationIsOpen(false);
        },
      }
    ]);
    setConfirmationProps(props);
    setConfirmationIsOpen(true);
  };


  const [saveCancelIsOpen, setSaveCancelIsOpen] = useState<boolean>(false);
  const [saveCancelActions, setSaveCancelActions] = useState<DialogAction[]>([]);
  const [saveCancelProps, setSaveCancelProps] = useState<SaveCancelDialogProps>();

  const openSaveCancelDialog = (props: SaveCancelDialogProps): void => {
    setSaveCancelActions([
      {
        label: translate('COMMON.ACTIONS.YES'),
        icon: <Check />,
        func: (data: any) => {
          if (props.onSave) props.onSave(data);
          setSaveCancelIsOpen(false);
        },
      },
      {
        close: true,
        label: translate('COMMON.ACTIONS.NO'),
        func: (data: any) => {
          if (props.onCancel) props.onCancel(data);
          setSaveCancelIsOpen(false);
        },
      }
    ]);
    setSaveCancelProps(props);
    setSaveCancelIsOpen(true);
  };

  return (
    <>
      <DialogsContext value={{
        openToast,
        openToasts,
        openInfoToast,
        openSuccessToast,
        openWarningToast,
        openErrorToast,
        openConfirmationDialog,
        openSaveCancelDialog,
      }}>
        {children}

        {toastProps && <ToastMessage key={crypto.randomUUID()} props={toastProps} />}

        {toastsProps && <ToastMessages key={crypto.randomUUID()} props={toastsProps} />}

        {confirmationProps &&
          <AlertMessageDialog
            key={crypto.randomUUID()}
            isOpen={confirmationIsOpen}
            setIsOpen={setConfirmationIsOpen}
            data={confirmationProps.data}
            title={confirmationProps.title}
            description={confirmationProps.description}
            actions={confirmationActions}
          >
          </AlertMessageDialog>
        }

        {saveCancelProps && (
          <WindowDialog
            key={crypto.randomUUID()}
            isOpen={saveCancelIsOpen}
            setIsOpen={setSaveCancelIsOpen}
            data={saveCancelProps.data}
            title={saveCancelProps.title}
            description={saveCancelProps.description}
            actions={saveCancelActions}
          >
            {saveCancelProps.renderContent
              ? saveCancelProps.renderContent(saveCancelProps.data)
              : <></>}
          </WindowDialog>
        )}

      </DialogsContext>
    </>
  );
}
