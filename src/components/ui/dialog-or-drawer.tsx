"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

function DialogOrDrawer({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const isMobile = useIsMobile();
  return isMobile ? <Drawer {...props} /> : <Dialog {...props} />;
}

function DialogOrDrawerTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  const isMobile = useIsMobile();
  return isMobile ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />;
}

function DialogOrDrawerClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const isMobile = useIsMobile();
  return isMobile ? <DrawerClose {...props} /> : <DialogClose {...props} />;
}

function DialogOrDrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DrawerContent className={cn("p-4", className)} {...props}>
      {children}
    </DrawerContent>
  ) : (
    <DialogContent className={cn(className)} {...props}>
      {children}
    </DialogContent>
  );
}

function DialogOrDrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DrawerHeader className={cn("px-0", className)} {...props} />
  ) : (
    <DialogHeader className={cn(className)} {...props} />
  );
}

function DialogOrDrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DrawerFooter className={cn(className)} {...props} />
  ) : (
    <DialogFooter className={cn(className)} {...props} />
  );
}

function DialogOrDrawerTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DrawerTitle className={cn(className)} {...props} />
  ) : (
    <DialogTitle className={cn(className)} {...props} />
  );
}

function DialogOrDrawerDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <DrawerDescription className={cn(className)} {...props} />
  ) : (
    <DialogDescription className={cn(className)} {...props} />
  );
}

export {
  DialogOrDrawer,
  DialogOrDrawerClose,
  DialogOrDrawerContent,
  DialogOrDrawerDescription,
  DialogOrDrawerFooter,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
  DialogOrDrawerTrigger,
};
