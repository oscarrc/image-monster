import { Options, ProcessedImage } from "../../types/imageProcessing";

import { createContext } from "react";

export interface ImageProcessingContextType {
  image: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  modelLoading: boolean;
  loadingProgress: number;
  hasProcessedImages: boolean;
  options: Options;
  selectedModel: string;
  setImage: (image: string | null) => void;
  setProcessedImage: (image: string | null) => void;
  processImage: (image: string | URL) => Promise<string>;
  resetImage: () => void;
  resetProcessing: () => void;
  updateOptions: (newOptions: Partial<Options>) => void;
  updateSelectedModel: (modelName: string) => void;

  images: ProcessedImage[];
  addImages: (files: FileList) => void;
  processAllImages: () => Promise<void>;
  processImageById: (id: string) => Promise<void>;
  updateImageOptions: (id: string, options: Partial<Options>) => void;
  removeImage: (id: string) => void;
}

export const ImageProcessingContext = createContext<ImageProcessingContextType>(
  {
    image: null,
    processedImage: null,
    isProcessing: false,
    modelLoading: false,
    loadingProgress: 0,
    hasProcessedImages: false,
    options: {
      threshold: 0.5,
      thresholdEnabled: false,
      smoothingEnabled: false,
      smoothingRadius: 3,
      featherEnabled: false,
      featherRadius: 5,
      preserveEdges: false,
    },
    selectedModel: "RMGB-1.4",
    setImage: () => {},
    setProcessedImage: () => {},
    processImage: async () => "",
    resetImage: () => {},
    resetProcessing: () => {},
    updateOptions: () => {},
    updateSelectedModel: () => {},

    images: [],
    addImages: () => {},
    processAllImages: async () => {},
    processImageById: async () => {},
    updateImageOptions: () => {},
    removeImage: () => {},
  }
);
