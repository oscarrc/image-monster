import {
  AutoModel,
  AutoProcessor,
  PreTrainedModel,
  Processor,
  ProgressInfo,
  RawImage,
  env,
} from "@huggingface/transformers";
import { MODES, ProcessingOptions } from "../../types/imageProcessing";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { ImageProcessingContext } from ".";

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODELS = {
  [MODES.BACKGROUND]: "Xenova/modnet",
  [MODES.ENHANCE]: "Xenova/swin2SR-realworld-sr-x4-64-bsrgan-psnr",
  [MODES.STYLE]: "Xenova/stable-diffusion-v1-5",
};

const DEFAULT_OPTIONS: ProcessingOptions = {
  [MODES.BACKGROUND]: {
    threshold: 0.5,
    thresholdEnabled: false,
    smoothingEnabled: false,
    smoothingRadius: 3,
    featherEnabled: false,
    featherRadius: 5,
    preserveEdges: false,
  },
  [MODES.ENHANCE]: {
    scale: 1.0,
    zoomEnabled: false,
    zoomLevel: 50,
  },
  [MODES.STYLE]: {
    styleStrength: 0.5,
    numInferenceSteps: 20,
    guidanceScale: 7.5,
    style: "ghibli.png",
  },
};

export const ImageProcessingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<MODES>(MODES.BACKGROUND);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [options, setOptions] = useState<ProcessingOptions>(DEFAULT_OPTIONS);

  const model = useRef<PreTrainedModel | null>(null);
  const processor = useRef<Processor | null>(null);
  const styleImage = useRef<RawImage | null>(null);

  const progresCallback = (p: ProgressInfo) => {
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
  };

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
    styleImage.current = null;
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

      model.current = await AutoModel.from_pretrained(MODELS[mode], {
        progress_callback: progresCallback,
      });
      processor.current = await AutoProcessor.from_pretrained(MODELS[mode], {});

      if (mode === MODES.STYLE && !styleImage.current) {
        try {
          styleImage.current = await RawImage.fromURL(
            "/assets/styles/ghibbli.png"
          );
        } catch (error) {
          console.error("Error loading style image:", error);
          throw new Error("Failed to load style image");
        }
      }
    } catch (error) {
      console.error("Error loading model:", error);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          "GPU resources are no longer available. Please refresh the page and try again."
        );
      }
      throw new Error("Failed to load AI model");
    }
  }, [mode, cleanup]);

  const removeBackground = async (
    img: RawImage,
    options: ProcessingOptions[MODES.BACKGROUND]
  ) => {
    const targetSize = 512;
    const resizedImage = await img.resize(targetSize, targetSize);

    const { pixel_values } = await processor.current!(resizedImage);
    const { output } = await model.current!({
      input: pixel_values,
    });

    // Process the mask with better quality
    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        img.width,
        img.height
      )
    ).data;

    let processedMask = new Uint8Array(maskData);

    // Apply smoothing if enabled
    if (options.smoothingEnabled) {
      const kernelSize = options.smoothingRadius * 2 + 1;
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
    if (options.featherEnabled) {
      const featherMask = new Uint8Array(processedMask.length);
      const featherRadius = options.featherRadius;

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
    if (options.thresholdEnabled) {
      for (let i = 0; i < processedMask.length; ++i) {
        if (processedMask[i] / 255 < options.threshold) {
          processedMask[i] = 0;
        } else {
          processedMask[i] = 255;
        }
      }
    }

    // Preserve edges if enabled
    if (options.preserveEdges) {
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

  const enhanceImage = async (
    img: RawImage,
    options: ProcessingOptions[MODES.ENHANCE]
  ) => {
    let processedImg = img;

    // Apply zoom if enabled
    if (options.zoomEnabled) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      const zoomFactor = options.zoomLevel / 100;
      const cropWidth = img.width * zoomFactor;
      const cropHeight = img.height * zoomFactor;
      const cropX = (img.width - cropWidth) / 2;
      const cropY = (img.height - cropHeight) / 2;

      ctx!.drawImage(
        img.toCanvas(),
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      processedImg = await RawImage.fromCanvas(canvas);
    }

    // Calculate maximum dimensions to prevent memory issues
    const MAX_DIMENSION = 512;
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(processedImg.width, processedImg.height)
    );

    // Resize the image if it's too large
    if (scale < 1) {
      const newWidth = Math.round(processedImg.width * scale);
      const newHeight = Math.round(processedImg.height * scale);
      processedImg = await processedImg.resize(newWidth, newHeight);
    }

    try {
      if (!model.current || !processor.current) {
        throw new Error("Model or processor not loaded");
      }

      // Process the image with the model
      const processed = await processor.current(processedImg);

      // Add a check for the output dimensions
      const inputHeight = processed.pixel_values.dims[2];
      const inputWidth = processed.pixel_values.dims[3];
      const outputHeight = inputHeight * options.scale;
      const outputWidth = inputWidth * options.scale;

      if (outputHeight > 1024 || outputWidth > 1024) {
        throw new Error(
          "Image dimensions after upscaling would be too large. Please try with a smaller image or reduce the zoom level."
        );
      }

      const { reconstruction } = await model.current({
        pixel_values: processed.pixel_values,
      });

      // The new model outputs a 4x upscaled image
      const enhancedImage = await RawImage.fromTensor(
        reconstruction[0].mul(255).clamp(0, 255).to("uint8")
      );

      const canvas = document.createElement("canvas");
      canvas.width = enhancedImage.width;
      canvas.height = enhancedImage.height;
      const ctx = canvas.getContext("2d");

      ctx!.drawImage(enhancedImage.toCanvas(), 0, 0);

      return canvas.toDataURL("image/png", 1.0);
    } catch (error) {
      console.error("Error in enhanceImage:", error);
      if (error instanceof Error) {
        if (error.message.includes("WebGPU")) {
          console.error("WebGPU error details:", error);
          throw new Error(
            "Image is too large to process. Please try with a smaller image or reduce the zoom level."
          );
        }
        if (error.message.includes("dimensions after upscaling")) {
          console.error("Dimension error details:", error);
          throw error;
        }
      }
      console.error("Unexpected error in enhanceImage:", error);
      throw new Error(
        "Failed to process image. Please try again with a smaller image."
      );
    }
  };

  const transferStyle = async (
    img: RawImage,
    options: ProcessingOptions[MODES.STYLE]
  ) => {
    if (!styleImage.current) {
      throw new Error("Style image not loaded");
    }

    const contentImage = await processor.current!(img);
    const styleImageProcessed = await processor.current!(styleImage.current);

    const { output } = await model.current!({
      prompt: "ghibli style",
      image: contentImage.pixel_values,
      style_image: styleImageProcessed.pixel_values,
      num_inference_steps: options.numInferenceSteps,
      guidance_scale: options.guidanceScale,
      style_strength: options.styleStrength,
    });

    const styledImage = await RawImage.fromTensor(
      output[0].mul(255).clamp(0, 255).to("uint8")
    );
    const canvas = document.createElement("canvas");
    canvas.width = styledImage.width;
    canvas.height = styledImage.height;
    const ctx = canvas.getContext("2d");

    ctx!.drawImage(styledImage.toCanvas(), 0, 0);

    return canvas.toDataURL("image/png", 1.0);
  };

  const processImage = async (processingMode: string, image: string | URL) => {
    if (!image) {
      throw new Error("No image provided");
    }

    setIsProcessing(true);
    try {
      await loadModel();

      let img: RawImage;
      try {
        img = await RawImage.fromURL(image);
      } catch (error) {
        console.error("Error loading image:", error);
        throw new Error("Failed to load image");
      }

      let processedImage: string = "";

      try {
        switch (processingMode) {
          case MODES.BACKGROUND:
            processedImage = await removeBackground(
              img,
              options[MODES.BACKGROUND]
            );
            break;
          case MODES.ENHANCE:
            processedImage = await enhanceImage(img, options[MODES.ENHANCE]);
            break;
          case MODES.STYLE:
            processedImage = await transferStyle(img, options[MODES.STYLE]);
            break;
          default:
            throw new Error("Invalid processing mode");
        }
      } catch (error) {
        console.error("Error in processImage:", error);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(
            "GPU resources are no longer available. Please refresh the page and try again."
          );
        }
        throw error;
      }

      return processedImage;
    } finally {
      setIsProcessing(false);
    }
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

  const updateOptions = (
    mode: MODES,
    newOptions: Partial<ProcessingOptions[MODES]>
  ) => {
    setOptions((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        ...newOptions,
      },
    }));
  };

  const value = {
    image,
    processedImage,
    mode,
    isProcessing,
    modelLoading,
    loadingProgress,
    options,
    setImage,
    setProcessedImage,
    setMode,
    processImage,
    resetImage,
    resetProcessing,
    updateOptions,
  };

  return (
    <ImageProcessingContext.Provider value={value}>
      {children}
    </ImageProcessingContext.Provider>
  );
};
