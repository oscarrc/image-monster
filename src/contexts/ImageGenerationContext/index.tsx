import { GeneratedImage, GenerationOptions } from "@/types/imageGeneration";

// src/contexts/ImageGenerationContext/index.tsx
import { createContext } from "react";

export interface ImageGenerationContextType {
  // Current prompt
  prompt: string;
  setPrompt: (prompt: string) => void;

  // Generated images list
  generatedImages: GeneratedImage[];

  // Generation state
  isGenerating: boolean;
  modelLoading: boolean;
  loadingProgress: number;

  // Selected model and options
  selectedModel: string;
  generationOptions: GenerationOptions;

  // Functions
  generateImage: (prompt?: string) => Promise<string | null>;
  updateGenerationOptions: (options: Partial<GenerationOptions>) => void;
  updateSelectedModel: (modelId: string) => void;
  removeGeneratedImage: (id: string) => void;
  clearGeneratedImages: () => void;
}

export const ImageGenerationContext = createContext<ImageGenerationContextType>(
  {
    // Default values
    prompt: "",
    setPrompt: () => {},
    generatedImages: [],
    isGenerating: false,
    modelLoading: false,
    loadingProgress: 0,
    selectedModel: "onnx-community/Janus-Pro-1B-ONNX",
    generationOptions: {
      maxNewTokens: 1024,
      doSample: true,
      temperature: 0.8,
      topK: 50,
      topP: 0.95,
      repetitionPenalty: 1.1,
    },
    generateImage: async () => null,
    updateGenerationOptions: () => {},
    updateSelectedModel: () => {},
    removeGeneratedImage: () => {},
    clearGeneratedImages: () => {},
  }
);
