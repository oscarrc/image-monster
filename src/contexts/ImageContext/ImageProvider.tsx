import { ReactNode, useState } from "react";

import { ImageContext } from ".";

// Provider component
export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Reset function
  const resetImage = () => {
    setImage(null);
    setProcessedImage(null);
  };

  const value = {
    image,
    processedImage,
    setImage,
    setProcessedImage,
    resetImage,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};
