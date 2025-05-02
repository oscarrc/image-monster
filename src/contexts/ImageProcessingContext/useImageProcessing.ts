import { ImageProcessingContext } from ".";
import { useContext } from "react";

export const useImageProcessing = () => {
  const context = useContext(ImageProcessingContext);

  if (context === undefined) {
    throw new Error("useImageProcessing must be used within an ImageProcessingProvider");
  }

  return context;
}; 