import { createContext } from "react";

export interface ImageContextType {
  // Image states
  image: string | null;
  processedImage: string | null;

  // Actions
  setImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  resetImage: () => void;
}

// Create context with default values
export const ImageContext = createContext<ImageContextType | undefined>(
  undefined
);
