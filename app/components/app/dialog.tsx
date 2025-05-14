import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Form } from "@remix-run/react";
import { cn } from "~/lib/utils";

export default function AppDialog({
  title,
  description,
  children,
  open,
  close,
  className,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  close: () => void;
  open: boolean;
  className?: string;
}) {
  return (
      <Dialog open={open} onOpenChange={close}>
        {/* <Form> */}
        <DialogContent
          className="max-h-[70h]"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader className="mx-auto">
            <DialogTitle className="text-center">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-center">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          {children}
          {/* <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter> */}
        </DialogContent>
        {/* </Form> */}
      </Dialog>
  );
}
