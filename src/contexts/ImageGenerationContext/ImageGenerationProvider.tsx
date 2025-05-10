import {
  AutoProcessor,
  MultiModalityCausalLM,
  PreTrainedModel,
  Processor,
  ProgressInfo,
} from "@huggingface/transformers";
import {
  DEFAULT_GENERATION_OPTIONS,
  GeneratedImage,
  GenerationOptions,
} from "@/types/imageGeneration";
// src/contexts/ImageGenerationContext/ImageGenerationProvider.tsx
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ImageGenerationContext } from ".";
import { env } from "@huggingface/transformers";
import { useToast } from "../ToastContext/useToast";

// Configure transformers.js environment
env.allowLocalModels = false;
env.useBrowserCache = true;

export const ImageGenerationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // State for inputs
  const [prompt, setPrompt] = useState<string>("");

  // State for outputs
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  // State for generation process
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Options and model selection
  const [selectedModel, setSelectedModel] = useState<string>(
    "onnx-community/Janus-Pro-1B-ONNX"
  );
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>(
    DEFAULT_GENERATION_OPTIONS
  );

  const { addToast } = useToast();

  // References to the model and processor
  const model = useRef<PreTrainedModel | null>(null);
  const processor = useRef<Processor | null>(null);

  // Progress callback for model loading
  const progressCallback = useCallback((p: ProgressInfo) => {
    const { status } = p;

    switch (status) {
      case "progress":
        setLoadingProgress(Math.round(p.progress * 100));
        break;
      case "initiate":
        setModelLoading(true);
        break;
      case "done":
      case "ready":
        setModelLoading(false);
        break;
      default:
        break;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (model.current) {
      try {
        model.current.dispose();
        model.current = null;
      } catch (error) {
        console.error("Error disposing model:", error);
      }
    }
    if (processor.current) {
      processor.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Load model function
  const loadModel = useCallback(async () => {
    try {
      // Cleanup existing resources before loading new ones
      cleanup();

      // Add a small delay to ensure cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const modelId = selectedModel;

      // Load the model
      model.current = await MultiModalityCausalLM.from_pretrained(modelId, {
        dtype: "q4",
        //@ts-expect-error navigator gpu
        device: navigator?.gpu ? "webgpu" : "wasm",
        progress_callback: progressCallback,
      });

      // Load the processor
      processor.current = await AutoProcessor.from_pretrained(modelId, {});

      return true;
    } catch (error) {
      console.error("Error loading model:", error);
      if (error instanceof Error && error.name === "AbortError") {
        addToast(
          "GPU resources are no longer available. Please refresh the page and try again.",
          "error"
        );
        return false;
      }
      addToast("Failed to load AI model", "error");
      return false;
    }
  }, [cleanup, progressCallback, selectedModel, addToast]);

  // Generate image function
  const generateImage = useCallback(
    async (customPrompt?: string) => {
      const promptToUse = customPrompt || prompt;

      if (!promptToUse.trim()) {
        addToast("Please enter a prompt", "warning");
        return null;
      }

      setIsGenerating(true);

      try {
        // Load model if not already loaded
        const modelLoaded = await loadModel();
        if (!modelLoaded) throw new Error("Failed to load model");

        if (!model.current || !processor.current) {
          throw new Error("Model or processor not initialized");
        }

        // Prepare conversation input
        const conversation = [
          {
            role: "<|User|>",
            content: promptToUse,
          },
        ];

        // Process inputs for text-to-image generation
        const inputs = await processor.current(conversation, {
          chat_template: "text_to_image",
        });

        // Get the number of image tokens from the processor
        //@ts-expect-error num_image_tokens
        const numImageTokens = processor.current.num_image_tokens;

        // Generate the image
        //@ts-expect-error generate_images
        const outputs = await model.current.generate_images({
          ...inputs,
          min_new_tokens: numImageTokens,
          max_new_tokens: numImageTokens,
          ...generationOptions,
        });

        // Convert the generated image to a data URL
        const canvas = outputs[0].toCanvas();
        const imageUrl = canvas.toDataURL("image/png");

        // Create a new generated image record
        const newImage: GeneratedImage = {
          id: crypto.randomUUID(),
          prompt: promptToUse,
          imageUrl,
          createdAt: new Date(),
        };

        // Add to the generated images list
        setGeneratedImages((prev) => [newImage, ...prev]);

        // Return the image URL
        return imageUrl;
      } catch (error) {
        console.error("Error generating image:", error);
        addToast("Failed to generate image. Please try again.", "error");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [prompt, loadModel, generationOptions, addToast]
  );

  // Update generation options
  const updateGenerationOptions = useCallback(
    (options: Partial<GenerationOptions>) => {
      setGenerationOptions((prev) => ({
        ...prev,
        ...options,
      }));
    },
    []
  );

  // Update selected model
  const updateSelectedModel = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      // Clean up existing model resources when changing models
      cleanup();
    },
    [cleanup]
  );

  // Remove a generated image
  const removeGeneratedImage = useCallback((id: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  // Clear all generated images
  const clearGeneratedImages = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  // Context value
  const value = {
    prompt,
    setPrompt,
    generatedImages,
    isGenerating,
    modelLoading,
    loadingProgress,
    selectedModel,
    generationOptions,
    generateImage,
    updateGenerationOptions,
    updateSelectedModel,
    removeGeneratedImage,
    clearGeneratedImages,
  };

  return (
    <ImageGenerationContext.Provider value={value}>
      {children}
    </ImageGenerationContext.Provider>
  );
};
