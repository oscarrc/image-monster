import { ImageGenerationContext } from ".";
// src/contexts/ImageGenerationContext/useImageGeneration.ts
import { useContext } from "react";

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  
  if (context === undefined) {
    throw new Error("useImageGeneration must be used within an ImageGenerationProvider");
  }
  
  return context;
};