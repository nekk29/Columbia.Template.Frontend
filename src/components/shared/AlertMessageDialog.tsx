/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check, XmarkCircle } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import { AlertDialog } from "@/components/tailgrids/core/alert-dialog";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";

export interface DialogProps {
  data?: any;
  title: string;
  description: string;
}

export interface DialogAction {
  label: string;
  icon?: React.ReactNode,
  variant?: "primary" | "danger" | "success" | "ghost";
  func: ((data: any) => void) | ((data: any) => any);
  close?: boolean
}

export interface AlertDialogProps extends DialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actions: DialogAction[];
}

export function AlertMessageDialog(props: AlertDialogProps) {
  return (
    <AlertDialog isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogDescription>
          {props.description}
        </DialogDescription>
      </DialogHeader>
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
              variant={action.variant ?? "primary"}
              key={`action_${index}`}
              onClick={() => { if (action.func) action.func(props.data); }}>
              {action.icon ?? <Check />}
              {action.label}
            </Button>
          );
        })}
      </DialogFooter>
    </AlertDialog>
  );
}
