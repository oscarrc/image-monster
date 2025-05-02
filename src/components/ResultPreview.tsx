import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import { useImageContext } from "@/contexts/ImageContext/useImageContext";

const ResultPreview = () => {
  const { image, processedImage } = useImageContext();

  if (!image || !processedImage) return null;

  const downloadProcessedImage = () => {
    if (!processedImage) return;

    const a = document.createElement("a");
    a.href = processedImage;
    a.download = `image-monster-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col"
    >
      <div className="relative w-full h-full flex-1 rounded-lg overflow-hidden bg-base-200">
        <button
          className="btn btn-xs btn-primary absolute top-2 right-2 z-10"
          onClick={downloadProcessedImage}
        >
          <FiDownload className="mr-1" /> Download
        </button>
        <figure className="diff h-full w-full" tabIndex={0}>
          <div className="diff-item-1" role="img" tabIndex={0}>
            <img alt="original" className="object-contain" src={image} />
          </div>
          <div className="diff-item-2" role="img">
            <img
              alt="processed"
              className="object-contain"
              src={processedImage}
            />
          </div>
          <div className="diff-resizer"></div>
        </figure>
      </div>
    </motion.div>
  );
};

export default ResultPreview;
