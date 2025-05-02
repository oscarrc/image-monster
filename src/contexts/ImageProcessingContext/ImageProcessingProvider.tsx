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
import { ReactNode, useCallback, useRef, useState } from "react";

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
    maskBackground: true,
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

  const loadModel = useCallback(async () => {
    model.current = await AutoModel.from_pretrained(MODELS[mode], {
      device: "webgpu",
      progress_callback: progresCallback,
    });
    processor.current = await AutoProcessor.from_pretrained(MODELS[mode], {
      device: "webgpu",
    });

    if (mode === MODES.STYLE && !styleImage.current) {
      styleImage.current = await RawImage.fromURL("/assets/styles/ghibbli.png");
    }
  }, [mode]);

  const removeBackground = async (
    img: RawImage,
    options: ProcessingOptions[MODES.BACKGROUND]
  ) => {
    const { pixel_values } = await processor.current!(img);
    const { output } = await model.current!({
      input: pixel_values,
      threshold: options.threshold,
      mask_background: options.maskBackground,
    });

    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        img.width,
        img.height
      )
    ).data;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    ctx!.drawImage(img.toCanvas(), 0, 0);

    const pixelData = ctx!.getImageData(0, 0, img.width, img.height);
    for (let i = 0; i < maskData.length; ++i) {
      pixelData.data[4 * i + 3] = maskData[i];
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

    const processed = await processor.current!(processedImg);
    const { output } = await model.current!({
      pixel_values: processed.pixel_values,
    });

    const uint8Tensor = output[0].mul(255).clamp(0, 255).to("uint8");
    const enhancedImage = await RawImage.fromTensor(uint8Tensor);

    // Apply scaling if needed
    if (options.scale !== 1.0) {
      const scaledCanvas = document.createElement("canvas");
      const scaledCtx = scaledCanvas.getContext("2d");

      scaledCanvas.width = enhancedImage.width * options.scale;
      scaledCanvas.height = enhancedImage.height * options.scale;

      if (scaledCtx) {
        scaledCtx.imageSmoothingEnabled = true;
        scaledCtx.imageSmoothingQuality = "high";
        scaledCtx.drawImage(
          enhancedImage.toCanvas(),
          0,
          0,
          scaledCanvas.width,
          scaledCanvas.height
        );
      }

      return scaledCanvas.toDataURL("image/png", 1.0);
    }

    const canvas = document.createElement("canvas");
    canvas.width = enhancedImage.width;
    canvas.height = enhancedImage.height;
    const ctx = canvas.getContext("2d");

    ctx!.drawImage(enhancedImage.toCanvas(), 0, 0);

    return canvas.toDataURL("image/png", 1.0);
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
    setIsProcessing(true);
    await loadModel();

    const img = await RawImage.fromURL(image);
    let processedImage: string = "";

    switch (processingMode) {
      case MODES.BACKGROUND:
        processedImage = await removeBackground(img, options[MODES.BACKGROUND]);
        break;
      case MODES.ENHANCE:
        processedImage = await enhanceImage(img, options[MODES.ENHANCE]);
        break;
      case MODES.STYLE:
        processedImage = await transferStyle(img, options[MODES.STYLE]);
        break;
      default:
        break;
    }

    setIsProcessing(false);
    return processedImage;
  };

  const resetImage = () => {
    setImage(null);
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
    updateOptions,
  };

  return (
    <ImageProcessingContext.Provider value={value}>
      {children}
    </ImageProcessingContext.Provider>
  );
};
