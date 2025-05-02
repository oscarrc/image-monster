import Controls from "@/components/Controls";
import ImagePreview from "@/components/ImagePreview";
import ResultDiffPreview from "@/components/ResultPreview";
import { motion } from "framer-motion";
import { useImageContext } from "@/contexts/ImageContext/useImageContext";

const ProcessView = () => {
  const { processedImage } = useImageContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {processedImage ? <ResultDiffPreview /> : <ImagePreview />}
        </div>
        <div className="h-full overflow-auto">
          <Controls />
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessView;
