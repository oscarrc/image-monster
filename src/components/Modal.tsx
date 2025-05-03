import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { ReactNode } from "react";

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
    full: "max-w-[95vw] max-h-[95vh]"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`${sizeClasses[size]} w-full bg-base-200 rounded-box shadow-xl overflow-hidden relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with title and close button */}
              {(title || showCloseButton) && (
                <div className="p-4 flex justify-between items-center border-b border-base-300">
                  {title && <h3 className="font-medium">{title}</h3>}
                  {showCloseButton && (
                    <button
                      className="btn btn-sm btn-ghost btn-circle"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <IoCloseOutline className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Modal body */}
              <div className="relative">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}; 