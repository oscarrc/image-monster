import { MODES, ProcessingOptions } from "@/types/imageProcessing";

import { createContext } from "react";

export interface ImageProcessingContextType {
  image: string | null;
  processedImage: string | null;
  mode: MODES;
  isProcessing: boolean;
  modelLoading: boolean;
  loadingProgress: number;
  options: ProcessingOptions;
  setImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  setMode: (mode: MODES) => void;
  processImage: (mode: string, image: string | URL) => Promise<string>;
  resetImage: () => void;
  resetProcessing: () => void;
  updateOptions: (
    mode: MODES,
    newOptions: Partial<ProcessingOptions[MODES]>
  ) => void;
}

export const ImageProcessingContext = createContext<ImageProcessingContextType>(
  {
    image: null,
    processedImage: null,
    mode: MODES.BACKGROUND,
    isProcessing: false,
    modelLoading: false,
    loadingProgress: 0,
    options: {
      [MODES.BACKGROUND]: {
        threshold: 0.5,
        thresholdEnabled: false,
        smoothingEnabled: true,
        smoothingRadius: 3,
        featherEnabled: false,
        featherRadius: 5,
        preserveEdges: true,
      },
      [MODES.ENHANCE]: {
        scale: 1.0,
        zoomEnabled: false,
        zoomLevel: 50,
      },
      [MODES.STYLE]: {
        styleStrength: 0.5,
        numInferenceSteps: 20,
        guidanceScale: 7.5,
        style: "Ghibli",
      },
    },
    setImage: () => {},
    setProcessedImage: () => {},
    setMode: () => {},
    processImage: async () => "",
    resetImage: () => {},
    resetProcessing: () => {},
    updateOptions: () => {},
  }
);
