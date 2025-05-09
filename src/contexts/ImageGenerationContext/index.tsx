import { createContext } from "react";

export interface ImageGenerationContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const ImageGenerationContext = createContext<ImageGenerationContextType>(
  {
    prompt: "",
    setPrompt: () => {},
  }
);
