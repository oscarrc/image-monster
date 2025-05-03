import { AnimatePresence, motion } from "framer-motion";
import { KeyboardEvent, ReactNode, useEffect, useRef } from "react";

import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = "lg",
}: ModalProps) => {
  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-3xl",
    full: "max-w-[95vw] max-h-[95vh]",
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Trap focus within the modal
  const handleTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // If shift key is pressed and we're on the first focusable element, move to the last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // If we're on the last focusable element, move to the first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // Handle escape key
  const handleEscKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the active element before the modal opened
      previousActiveElement.current = document.activeElement;

      // Focus the first focusable element in the modal
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }

      // Add global event listener for escape key
      const handleGlobalEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.addEventListener("keydown", handleGlobalEscape as any);

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.removeEventListener("keydown", handleGlobalEscape as any);
      };
    } else if (previousActiveElement.current) {
      // Restore focus when modal closes
      (previousActiveElement.current as HTMLElement).focus();
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal content */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`${sizeClasses[size]} w-full bg-base-200 rounded-box shadow-xl overflow-hidden relative`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                handleTabKey(e);
                handleEscKey(e);
              }}
            >
              {/* Header with title and close button */}
              {(title || showCloseButton) && (
                <div className="p-4 flex justify-between items-center border-b border-base-300">
                  {title && (
                    <h3 id="modal-title" className="font-medium">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      ref={initialFocusRef}
                      className="btn btn-sm btn-ghost btn-circle"
                      onClick={onClose}
                      aria-label="Close modal"
                      tabIndex={0}
                    >
                      <IoCloseOutline className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              {/* Modal body */}
              <div className="relative">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
