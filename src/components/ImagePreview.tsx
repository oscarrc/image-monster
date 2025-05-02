import { motion } from "framer-motion";
import { useImageContext } from "@/contexts/ImageContext/useImageContext";

const ImagePreview = () => {
  const { image } = useImageContext();

  if (!image) return null;

  const isProcessing = false;
  const modelLoading = false; // Replace with actual loading state
  const loadingProgress = 0; // Replace with actual loading progress

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col"
    >
      <div className="relative w-full h-full flex-1 rounded-lg overflow-hidden bg-base-200">
        <img
          src={image}
          alt="Image preview"
          className={`w-full h-full object-contain ${
            isProcessing || modelLoading ? "opacity-70" : ""
          }`}
        />

        {/* Processing overlay */}
        {(isProcessing || modelLoading) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-300/50 backdrop-blur-sm">
            <div className="text-center p-4 rounded-lg bg-base-200/80">
              <div className="loading loading-spinner loading-lg text-primary mb-2"></div>
              <p className="font-semibold mb-2">
                {isProcessing ? "Processing image..." : "Loading AI model..."}
              </p>
              <progress
                className="progress progress-primary w-56"
                value={loadingProgress}
                max="100"
              ></progress>
              <p className="text-xs mt-1">{loadingProgress}%</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImagePreview;
