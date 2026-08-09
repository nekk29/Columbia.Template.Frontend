import "./ToastMessage.css";
import { useState } from "react";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle
} from "@/components/tailgrids/core/alert";
import { Toast } from "./CustomToast";
import { Xmark2x } from "@tailgrids/icons";

export type ToastStatus = "info" | "success" | "warning" | "error";

interface ToastProps {
  mode: "toast" | "alert";
  className?: string;
}

export interface ToastMessageProps extends ToastProps {
  status: ToastStatus;
  isOpen: boolean;
  title: string;
  description: string;
}

export function ToastMessage({ props }: { props: ToastMessageProps }) {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  if (!props.isOpen) return null;

  if (props.mode === "toast") {
    return (
      <div className="app-toast">
        {isOpen &&
          <Toast
            variant={props.status}
            undoAction={() => setIsOpen(false)}
            message={{ title: props.title, description: props.description }}
          />
        }
      </div>
    );
  }

  return (
    <div className="app-toast">
      {isOpen &&
        <Alert status={props.status} className={props.className}>
          <AlertIndicator />
          <AlertContent>
            <AlertTitle className="w-full">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-2">
                <p>{props.title}</p>
                <button
                  type="button"
                  aria-label="Close"
                  className="flex flex-wrap justify-end close-button"
                  onClick={() => setIsOpen(false)}>
                  <Xmark2x className="h-lh" />
                </button>
              </div>
            </AlertTitle>
            <AlertDescription>
              {props.description}
            </AlertDescription>
          </AlertContent>
        </Alert>
      }
    </div>
  );
}

export interface ToastMessagesProps extends ToastProps {
  response?: ResponseBaseDto | null;
}

export function ToastMessages({ props }: { props: ToastMessagesProps }) {
  const [messages, setMessages] = useState(props.response?.messages ?? []);

  if (props.mode === "toast") {
    return (
      <div className="app-toast grid grid-cols-1 gap-y-2">
        {messages.map((message, index) =>
          <div key={`app-toast-${index}`} className="grid-cols-1">
            {message.isVisible &&
              <Toast
                variant={
                  message.messageType == 0 ? "success"
                    : message.messageType == 1 ? "info"
                      : message.messageType == 2 ? "warning"
                        : message.messageType == 3 ? "error" : "info"
                }
                message={{
                  title: message.messageTypeTitle ?? "Info",
                  description: message.message
                }}
                undoAction={() => {
                  message.isVisible = false;
                  setMessages([...messages]);
                }}
              />
            }
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-toast grid grid-cols-1 gap-y-2">
      {messages.map((message, index) =>
        <div key={`app-toast-${index}`} className="grid-cols-1 gap-y-4">
          {message.isVisible &&
            <Alert key={index} status={
              message.messageType == 0 ? "success"
                : message.messageType == 1 ? "info"
                  : message.messageType == 2 ? "warning" : "error"
            } className={props.className}>
              <AlertIndicator />
              <AlertContent>
                <AlertTitle className="w-full">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <p>{message.messageTypeTitle ?? "Info"}</p>
                    <button
                      type="button"
                      aria-label="Close"
                      className="flex flex-wrap justify-end close-button"
                      onClick={() => {
                        message.isVisible = false;
                        setMessages([...messages]);
                      }}>
                      <Xmark2x className="h-lh" />
                    </button>
                  </div>
                </AlertTitle>
                <AlertDescription>
                  {message.message}
                </AlertDescription>
              </AlertContent>
            </Alert>
          }
        </div>
      )}
    </div>
  );
}
