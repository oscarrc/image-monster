import { AutoModel, AutoProcessor, PreTrainedModel, Processor, ProgressInfo, RawImage, env } from '@huggingface/transformers';
import { useCallback, useRef, useState } from 'react';

env.allowLocalModels = false;
env.useBrowserCache = true;

export enum MODES {
  BACKGROUND = 'background',
  ENHANCE = 'enhance',
  STYLE = 'style',
  SEGMENT = 'segment',
}

const MODELS = {
  [MODES.BACKGROUND]: "Xenova/modnet",
  [MODES.ENHANCE]: "Xenova/4x_APISR_GRL_GAN_generator-onnx",
  [MODES.STYLE]: "Xenova/arbitrary-style-transfer",
  [MODES.SEGMENT]: "Xenova/detr-resnet-50",
}

export function useTransformerModel() {
  const [mode, setMode] = useState<MODES>(MODES.BACKGROUND);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const model = useRef<PreTrainedModel | null>(null);
  const processor = useRef<Processor | null>(null);

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
  }

  const loadModel = useCallback(async () => {     
    model.current = await AutoModel.from_pretrained(MODELS[mode], {
      device: "webgpu",    
      progress_callback: progresCallback, 
    });
    processor.current = await AutoProcessor.from_pretrained(MODELS[mode], {
      device: "webgpu",
    });
  }, [mode]);

  const processImage = async (processingMode: string, image: string | URL) => {
    setIsProcessing(true);

    if (!model.current || !processor.current || processingMode !== mode) {
      await loadModel();
    };

    const img = await RawImage.fromURL(image);
    
    const { pixel_values } = await processor.current!(img);
    const { output } = await model.current!({ input: pixel_values });

    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
        img.width,
        img.height,
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

    setIsProcessing(false);

    return canvas.toDataURL("image/png", 1.0);
  }
  
  return {
    mode,
    setMode,
    processImage,
    isProcessing,
    modelLoading,
    loadingProgress,
  };
}