import {
  AutoModel,
  AutoProcessor,
  PreTrainedModel,
  Processor,
  ProgressInfo,
  RawImage,
  env,
} from "@huggingface/transformers";
import {
  DEFAULT_OPTIONS,
  Options,
  ProcessedImage,
} from "../../types/imageProcessing";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ImageProcessingContext } from ".";
import { useToast } from "../ToastContext/useToast";

env.allowLocalModels = false;
env.useBrowserCache = true;

export const ImageProcessingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const [selectedModel, setSelectedModel] = useState<string>("briaai/RMBG-1.4");
  const { addToast } = useToast();

  const [images, setImages] = useState<ProcessedImage[]>([]);

  const model = useRef<PreTrainedModel | null>(null);
  const processor = useRef<Processor | null>(null);

  const hasProcessedImages = useMemo(
    () => images.some((img) => img.processedUrl !== null),
    [images]
  );

  const progresCallback = useCallback((p: ProgressInfo) => {
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

  // Cleanup function to dispose of WebGPU resources
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
      try {
        processor.current = null;
      } catch (error) {
        console.error("Error disposing processor:", error);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const loadModel = useCallback(async () => {
    try {
      // Cleanup existing resources before loading new ones
      cleanup();

      // Add a small delay to ensure cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const modelId = selectedModel;

      model.current = await AutoModel.from_pretrained(modelId, {
        dtype: "fp32",
        progress_callback: progresCallback,
      });
      processor.current = await AutoProcessor.from_pretrained(modelId, {});
    } catch (error) {
      console.error("Error loading model:", error);
      if (error instanceof Error && error.name === "AbortError") {
        addToast(
          "GPU resources are no longer available. Please refresh the page and try again.",
          "error"
        );
        return null;
      }
      addToast("Failed to load AI model", "error");
      return null;
    }
  }, [cleanup, progresCallback, selectedModel, addToast]);

  const removeBackground = async (img: RawImage, optionsToUse: Options) => {
    const targetSize = 512;
    const resizedImage = await img.resize(targetSize, targetSize);

    const { pixel_values } = await processor.current!(resizedImage);
    const { output, output_image } = await model.current!({
      input: pixel_values,
      input_image: pixel_values,
    });

    console.log("Model output:", output, output_image);

    const outputImage = output || output_image;

    // Process the mask with better quality
    const maskData = (
      await RawImage.fromTensor(outputImage[0].mul(255).to("uint8")).resize(
        img.width,
        img.height
      )
    ).data;

    let processedMask = new Uint8Array(maskData);

    // Apply smoothing if enabled
    if (optionsToUse.smoothingEnabled) {
      const kernelSize = optionsToUse.smoothingRadius * 2 + 1;
      const halfKernel = Math.floor(kernelSize / 2);
      const smoothedMask = new Uint8Array(maskData.length);

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          let sum = 0;
          let count = 0;

          for (let ky = -halfKernel; ky <= halfKernel; ky++) {
            for (let kx = -halfKernel; kx <= halfKernel; kx++) {
              const nx = x + kx;
              const ny = y + ky;

              if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
                sum += maskData[ny * img.width + nx];
                count++;
              }
            }
          }

          smoothedMask[y * img.width + x] = Math.round(sum / count);
        }
      }
      processedMask = smoothedMask;
    }

    // Apply feathering if enabled
    if (optionsToUse.featherEnabled) {
      const featherMask = new Uint8Array(processedMask.length);
      const featherRadius = optionsToUse.featherRadius;

      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          let maxValue = 0;
          let minValue = 255;

          // Find min and max values in the neighborhood
          for (let ky = -featherRadius; ky <= featherRadius; ky++) {
            for (let kx = -featherRadius; kx <= featherRadius; kx++) {
              const nx = x + kx;
              const ny = y + ky;

              if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
                const value = processedMask[ny * img.width + nx];
                maxValue = Math.max(maxValue, value);
                minValue = Math.min(minValue, value);
              }
            }
          }

          // Apply feathering based on the difference
          const diff = maxValue - minValue;
          if (diff > 0) {
            const featherFactor = Math.min(1, diff / 255);
            featherMask[y * img.width + x] = Math.round(
              processedMask[y * img.width + x] * (1 - featherFactor * 0.5)
            );
          } else {
            featherMask[y * img.width + x] = processedMask[y * img.width + x];
          }
        }
      }
      processedMask = featherMask;
    }

    // Apply threshold if enabled
    if (optionsToUse.thresholdEnabled) {
      for (let i = 0; i < processedMask.length; ++i) {
        if (processedMask[i] / 255 < optionsToUse.threshold) {
          processedMask[i] = 0;
        } else {
          processedMask[i] = 255;
        }
      }
    }

    // Preserve edges if enabled
    if (optionsToUse.preserveEdges) {
      const edgeMask = new Uint8Array(processedMask.length);
      const edgeKernel = [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1],
      ];

      for (let y = 1; y < img.height - 1; y++) {
        for (let x = 1; x < img.width - 1; x++) {
          let edgeValue = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              edgeValue +=
                processedMask[(y + ky) * img.width + (x + kx)] *
                edgeKernel[ky + 1][kx + 1];
            }
          }
          edgeMask[y * img.width + x] = Math.min(255, Math.max(0, edgeValue));
        }
      }

      // Combine edge mask with processed mask
      for (let i = 0; i < processedMask.length; i++) {
        processedMask[i] = Math.max(processedMask[i], edgeMask[i]);
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    ctx!.drawImage(img.toCanvas(), 0, 0);

    const pixelData = ctx!.getImageData(0, 0, img.width, img.height);
    for (let i = 0; i < processedMask.length; ++i) {
      pixelData.data[4 * i + 3] = processedMask[i];
    }
    ctx!.putImageData(pixelData, 0, 0);

    return canvas.toDataURL("image/png", 1.0);
  };

  const processImage = async (imageUrl: string | URL) => {
    if (!imageUrl) {
      addToast("No image provided", "error");
      return null;
    }

    setIsProcessing(true);
    try {
      await loadModel();

      let img: RawImage;
      try {
        img = await RawImage.fromURL(imageUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        addToast("Failed to load image", "error");
        throw error;
      }

      const processedImage = await removeBackground(img, options);
      return processedImage;
    } catch (error) {
      console.error("Error in processImage:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const addImages = (files: FileList) => {
    const newImages: ProcessedImage[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      originalUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: "pending",
      name: file.name,
      options: { ...DEFAULT_OPTIONS },
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const processImageById = async (id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;

    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: "processing" } : img
      )
    );

    try {
      await loadModel();

      let img: RawImage;
      try {
        img = await RawImage.fromURL(image.originalUrl);
      } catch (error) {
        console.error("Error loading image:", error);
        addToast(`Failed to load image: ${image.name}`, "error");
        throw error;
      }

      const processedUrl = await removeBackground(img, image.options);

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, processedUrl, status: "completed" } : img
        )
      );

      addToast(`Background removed from ${image.name}`, "success");
    } catch (error) {
      console.error("Error processing image:", error);
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, status: "error" } : img))
      );
      addToast(`Error processing ${image.name}`, "error");
    }
  };

  const processAllImages = async () => {
    setIsProcessing(true);
    try {
      for (const image of images) {
        if (image.status === "pending" || image.status === "error") {
          await processImageById(image.id);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const updateImageOptions = (id: string, newOptions: Partial<Options>) => {
    if (id === "global") {
      // Update global options for new images
      setOptions((prev) => ({
        ...prev,
        ...newOptions,
      }));
      return;
    }

    // Update options for a specific image
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, options: { ...img.options, ...newOptions } }
          : img
      )
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const resetImage = () => {
    setImage(null);
    setProcessedImage(null);
  };

  const resetProcessing = () => {
    setIsProcessing(false);
    setModelLoading(false);
    setLoadingProgress(0);
    setProcessedImage(null);
  };

  const updateOptions = (newOptions: Partial<Options>) => {
    setOptions((prev) => ({
      ...prev,
      ...newOptions,
    }));
  };

  const updateSelectedModel = (modelName: string) => {
    setSelectedModel(modelName);
  };

  const value = {
    image,
    processedImage,
    isProcessing,
    modelLoading,
    loadingProgress,
    options,
    selectedModel,
    hasProcessedImages,
    setImage,
    setProcessedImage,
    processImage,
    resetImage,
    resetProcessing,
    updateOptions,
    updateSelectedModel,

    images,
    addImages,
    processAllImages,
    processImageById,
    updateImageOptions,
    removeImage,
  };

  return (
    <ImageProcessingContext.Provider value={value}>
      {children}
    </ImageProcessingContext.Provider>
  );
};
