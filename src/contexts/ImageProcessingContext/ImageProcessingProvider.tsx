import {
  AutoModel,
  AutoProcessor,
  PreTrainedModel,
  Processor,
  ProgressInfo,
  RawImage,
  env,
} from "@huggingface/transformers";
import { ReactNode, useCallback, useRef, useState } from "react";

import { ImageProcessingContext } from ".";
import { MODES } from "../../types/imageProcessing";

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODELS = {
  [MODES.BACKGROUND]: "Xenova/modnet",
  [MODES.ENHANCE]: "Xenova/swin2SR-realworld-sr-x4-64-bsrgan-psnr",
  [MODES.STYLE]: "Xenova/stable-diffusion-v1-5",
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

  const removeBackground = async (img: RawImage) => {
    const { pixel_values } = await processor.current!(img);
    const { output } = await model.current!({ input: pixel_values });

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

  const enhanceImage = async (img: RawImage) => {
    const processed = await processor.current!(img);
    const { output } = await model.current!({
      pixel_values: processed.pixel_values,
    });

    const uint8Tensor = output[0].mul(255).clamp(0, 255).to("uint8");

    const enhancedImage = await RawImage.fromTensor(uint8Tensor);
    const canvas = document.createElement("canvas");
    canvas.width = enhancedImage.width;
    canvas.height = enhancedImage.height;
    const ctx = canvas.getContext("2d");

    ctx!.drawImage(enhancedImage.toCanvas(), 0, 0);

    return canvas.toDataURL("image/png", 1.0);
  };

  const transferStyle = async (img: RawImage) => {
    if (!styleImage.current) {
      throw new Error("Style image not loaded");
    }

    const contentImage = await processor.current!(img);
    const styleImageProcessed = await processor.current!(styleImage.current);

    const { output } = await model.current!({
      prompt: "ghibli style",
      image: contentImage.pixel_values,
      style_image: styleImageProcessed.pixel_values,
      num_inference_steps: 20,
      guidance_scale: 7.5,
    });

    const styledImage = await RawImage.fromTensor(output[0].mul(255).clamp(0, 255).to("uint8"));
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
        processedImage = await removeBackground(img);
        break;
      case MODES.ENHANCE:
        processedImage = await enhanceImage(img);
        break;
      case MODES.STYLE:
        processedImage = await transferStyle(img);
        break;
      default:
        break;
    }

    setIsProcessing(false);
    return processedImage;
  };

  // Reset function
  const resetImage = () => {
    setImage(null);
    setProcessedImage(null);
  };

  const value = {
    image,
    processedImage,
    mode,
    isProcessing,
    modelLoading,
    loadingProgress,
    setImage,
    setProcessedImage,
    setMode,
    processImage,
    resetImage,
  };

  return (
    <ImageProcessingContext.Provider value={value}>
      {children}
    </ImageProcessingContext.Provider>
  );
};
