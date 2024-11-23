import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";

//lib
import { useMediaQuery } from "react-responsive";

//props
interface ModalProps {
  onOpenChange? :(open: boolean)=> void
  onFunction?: () => Promise<void>;
  open?: boolean | undefined;
  children?: React.ReactNode;
  title?: string | undefined;
  footer?: boolean | undefined;
  loading?: boolean;
  className?: string;
}

const Modal = ({
  onOpenChange,
  open,
  title,
  children,
  footer,
  onFunction,
  loading,
  className
}: ModalProps) => {
  // const isSmall = useMediaQuery({ query: `(max-width: 600px)` });
  // const isMedium = useMediaQuery({ query: `(min-width: 764px)` });
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={className}>
          <DialogHeader>
            <DialogTitle className=" capitalize">{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription ></DialogDescription>
          <div className="w-full">{children}</div>
          {footer && (
            <DialogFooter>
              <Button onClick={onFunction} disabled={loading}>
                {loading ? "Please wait..." : "Confirm"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <div className="w-full">{children}</div>
        {footer && (
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default Modal;
