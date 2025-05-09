import { ReactNode, useState } from "react";

import { ImageGenerationContext } from ".";
import { env } from "@huggingface/transformers";

env.allowLocalModels = false;
env.useBrowserCache = true;

export const ImageGenerationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [prompt, setPrompt] = useState<string>("");

  const value = {
    prompt,
    setPrompt,
  };

  return (
    <ImageGenerationContext.Provider value={value}>
      {children}
    </ImageGenerationContext.Provider>
  );
};
