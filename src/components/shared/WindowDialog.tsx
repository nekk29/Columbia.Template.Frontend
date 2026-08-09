/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { XmarkCircle } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import type { AlertDialogProps } from "@/components/shared/AlertMessageDialog";

import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";

export interface WindowsDialogProps extends AlertDialogProps {
  children: React.ReactNode,
}

export function WindowDialog(props: WindowsDialogProps) {
  return (
    <AlertDialog isOpen={props.isOpen} onOpenChange={props.setIsOpen} className="w-full max-w-2xl">
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogDescription>
          {props.description}
        </DialogDescription>
      </DialogHeader>
      <DialogBody>
        {props.children}
      </DialogBody>
      <DialogFooter>
        {props.actions && props.actions.map((action, index) => {
          if (action.close) {
            return (
              <DialogClose
                size="xs"
                variant="danger"
                key={`action_${index}`}
                onClick={() => { if (action.func) action.func(props.data); }}>
                <XmarkCircle />
                {action.label}
              </DialogClose>
            );
          }

          return (
            <Button
              size="xs"
              variant={action.variant}
              key={`action_${index}`}
              onClick={() => { if (action.func) action.func(props.data); }}>
              {action.icon}
              {action.label}
            </Button>
          );
        })}
      </DialogFooter>
    </AlertDialog>
  );
}
