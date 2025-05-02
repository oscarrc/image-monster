import { createContext } from "react";
import { MODES } from "../../types/imageProcessing";

export interface ImageProcessingContextType {
  // Image states
  image: string | null;
  processedImage: string | null;
  mode: MODES;
  isProcessing: boolean;
  modelLoading: boolean;
  loadingProgress: number;

  // Actions
  setImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  setMode: (mode: MODES) => void;
  processImage: (processingMode: string, image: string | URL) => Promise<string>;
  resetImage: () => void;
}

// Create context with default values
export const ImageProcessingContext = createContext<ImageProcessingContextType | undefined>(
  undefined
); 