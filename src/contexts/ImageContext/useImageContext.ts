import { ImageContext } from ".";
import { useContext } from "react";

export const useImageContext = () => {
  const context = useContext(ImageContext);

  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }

  return context;
};
