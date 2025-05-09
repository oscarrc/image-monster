import { ImageGenerationContext } from ".";
import { useContext } from "react";

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  if (!context) {
    throw new Error("useImageGeneration must be used within an ImageGenerationProvider");
  }
  return context;
}; 