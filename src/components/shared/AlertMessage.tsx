import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIndicator,
  AlertTitle
} from "@/components/tailgrids/core/alert";

import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

export interface AlertMessageProps {
  status: "info" | "success" | "warning" | "error";
  title: string;
  description: string;
  className?: string;
}

export function AlertMessage({ status, title, description, className }: AlertMessageProps) {
  return (
    <Alert status={status} className={className}>
      <AlertIndicator />
      <AlertContent>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {description}
        </AlertDescription>
      </AlertContent>
    </Alert>
  );
}

export interface AlertMessagesProps {
  response: ResponseBaseDto;
  className?: string;
}

export function AlertMessages({ response, className }: AlertMessagesProps) {
  return (
    <>
      {(response?.messages ?? []).map((message, index) => (
        <Alert key={index} status={
          message.messageType == 0 ? "success"
            : message.messageType == 1 ? "info"
              : message.messageType == 2 ? "warning" : "error"
        } className={className}>
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>{
              message.messageType == 0 ? "Success"
                : message.messageType == 1 ? "Info"
                  : message.messageType == 2 ? "Warning" : "Error"
            }</AlertTitle>
            <AlertDescription>
              {message.message}
            </AlertDescription>
          </AlertContent>
        </Alert>
      ))}
    </>
  );
}
