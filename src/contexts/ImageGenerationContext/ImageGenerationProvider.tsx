// src/contexts/ImageGenerationContext/ImageGenerationProvider.tsx
import {
  AutoProcessor,
  MultiModalityCausalLM,
  PreTrainedModel,
  Processor,
  ProgressInfo,
  env,
} from "@huggingface/transformers";
import {
  DEFAULT_GENERATION_OPTIONS,
  GeneratedImage,
  GenerationOptions,
} from "@/types/imageGeneration";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ImageGenerationContext } from ".";
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

  // WebGPU feature check function - no classes needed
  const checkWebGPUSupport = useCallback(async (): Promise<boolean> => {
    try {
      // @ts-expect-error navigator.gpu
      if (!navigator.gpu) return false;
      // @ts-expect-error navigator.gpu
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) return false;
      return adapter.features.has("shader-f16");
    } catch (e) {
      console.error("WebGPU feature detection error:", e);
      return false;
    }
  }, []);

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

  // Load model function with optimized memory settings
  const loadModel = useCallback(async () => {
    try {
      // Cleanup existing resources before loading new ones
      cleanup();

      // Add a small delay to ensure cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const modelId = selectedModel;

      // Check WebGPU support
      const fp16Supported = await checkWebGPUSupport();

      // Set precision based on options or default to auto-detection
      const precision = generationOptions.precision || "auto";
      const useFP16 =
        precision === "auto" ? fp16Supported : precision === "high";

      // Choose between performance and memory efficiency
      const prioritizeSpeed = generationOptions.prioritizeSpeed || false;

      // Set device types based on available hardware
      // @ts-expect-error navigator.gpu
      const deviceType = navigator?.gpu ? "webgpu" : "wasm";

      // Configure dtype options based on precision settings
      let dtypeConfig;

      if (useFP16) {
        dtypeConfig = {
          prepare_inputs_embeds: "q4",
          language_model: "q4f16",
          lm_head: "fp16",
          gen_head: "fp16",
          gen_img_embeds: "fp16",
          image_decode: "fp32",
        };
      } else {
        dtypeConfig = {
          prepare_inputs_embeds: "fp32",
          language_model: prioritizeSpeed ? "q4" : "q4f16",
          lm_head: "fp32",
          gen_head: "fp32",
          gen_img_embeds: "fp32",
          image_decode: "fp32",
        };
      }

      // Configure device allocation - inputs on CPU, model on GPU when available
      const deviceConfig = {
        prepare_inputs_embeds: "wasm", // Always use wasm for inputs
        language_model: deviceType,
        lm_head: deviceType,
        gen_head: deviceType,
        gen_img_embeds: deviceType,
        image_decode: deviceType,
      };

      // Load the model with optimized settings
      model.current = await MultiModalityCausalLM.from_pretrained(modelId, {
        // @ts-expect-error dtypeConfig
        dtype: dtypeConfig,
        // @ts-expect-error deviceConfig
        device: deviceConfig,
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
  }, [
    cleanup,
    progressCallback,
    selectedModel,
    addToast,
    checkWebGPUSupport,
    generationOptions,
  ]);

  // Generate image function
  const generateImage = useCallback(
    async (customPrompt?: string) => {
      const promptToUse = customPrompt || prompt;

      if (!promptToUse.trim()) {
        addToast("Please enter a prompt", "warning");
        return null;
      }

      setIsGenerating(true);
      setLoadingProgress(0);

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

        // Generate the image with optimized settings
        //@ts-expect-error generate_images
        const outputs = await model.current.generate_images({
          ...inputs,
          min_new_tokens: numImageTokens,
          max_new_tokens: numImageTokens,
          do_sample: generationOptions.doSample,
          temperature: generationOptions.temperature,
          top_k: generationOptions.topK,
          top_p: generationOptions.topP,
          repetition_penalty: generationOptions.repetitionPenalty,
        });

        // Get the image output and convert it to a URL
        const blob = await outputs[0].toBlob();
        const imageUrl = await URL.createObjectURL(blob);

        // Create a new generated image record
        const newImage: GeneratedImage = {
          id: crypto.randomUUID(),
          prompt: promptToUse,
          imageUrl,
          createdAt: new Date(),
        };

        // Add to the generated images list
        setGeneratedImages((prev) => [...prev, newImage]);

        // Return the image URL
        return imageUrl;
      } catch (error) {
        console.error("Error generating image:", error);
        addToast("Failed to generate image. Please try again.", "error");
        return null;
      } finally {
        setIsGenerating(false);
        setLoadingProgress(0);
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
