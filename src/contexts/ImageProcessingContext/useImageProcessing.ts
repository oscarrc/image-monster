import { useContext } from "react";
import { ImageProcessingContext } from ".";

export const useImageProcessing = () => {
  const context = useContext(ImageProcessingContext);
  if (!context) {
    throw new Error("useImageProcessing must be used within an ImageProcessingProvider");
  }
  return context;
}; 