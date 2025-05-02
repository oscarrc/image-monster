import { FiArrowLeft, FiInfo } from "react-icons/fi";

import { MODES } from "@/types/imageProcessing";
import { motion } from "framer-motion";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";
import { useNavigate } from "react-router-dom";
import BackgroundOptions from "./BackgroundOptions";
import EnhanceOptions from "./EnhanceOptions";
import StyleOptions from "./StyleOptions";

const ModeInfo = {
  [MODES.BACKGROUND]: {
    label: "Remove Background",
    info: "This will remove the background from your image, keeping only the main subject.",
    options: BackgroundOptions,
  },
  [MODES.ENHANCE]: {
    label: "Enhance",
    info: "This will enhance the details and quality of your image with AI upscaling.",
    options: EnhanceOptions,
  },
  [MODES.STYLE]: {
    label: "Style Transfer",
    info: "This will apply an artistic style (Ghibli) to your image.",
    options: StyleOptions,
  },
} as Record<string, { label: string; info: string; options: React.ComponentType }>;

const Controls = () => {
  const {
    mode,
    setMode,
    isProcessing,
    processImage,
    image,
    processedImage,
    resetImage,
    setProcessedImage,
  } = useImageProcessing();
  const navigate = useNavigate();

  const handleBack = () => {
    resetImage();
    navigate("/");
  };

  const handleProcessing = async () => {
    if (!image) return;
    try {
      const processed = await processImage(mode, image);
      setProcessedImage(processed);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  if (!image) return null;

  const OptionsComponent = ModeInfo[mode].options;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col"
    >
      <div className="bg-base-200 rounded-lg p-4 flex flex-col h-full w-full gap-4">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="btn btn-circle btn-ghost">
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-semibold">Choose Processing Option</h3>
        </div>
        <div className="tabs tabs-border">
          {Object.keys(ModeInfo).map((key) => (
            <button
              key={key}
              className={`tab flex-1 ${mode === key ? "tab-active" : ""}`}
              onClick={() => setMode(key as MODES)}
            >
              {ModeInfo[key].label}
            </button>
          ))}
        </div>

        <div className="space-y-4 flex flex-col flex-1">
          <OptionsComponent />
          <div className="alert border border-primary text-primary mt-auto">
            <FiInfo className="w-5 h-5" />
            <span>{ModeInfo[mode].info}</span>
          </div>
        </div>
        {!processedImage ? (
          <button
            className="btn btn-primary btn-block"
            disabled={isProcessing}
            onClick={handleProcessing}
          >
            {isProcessing && <span className="loading loading-spinner"></span>}
            {isProcessing ? "Processing..." : "Process Image"}
          </button>
        ) : (
          <button
            className="btn btn-outline btn-block btn-primary"
            onClick={() => setProcessedImage(null)}
          >
            Try Another Effect
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Controls;
