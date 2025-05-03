import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ImageList } from "./components/ImageList";
import Layout from "./components/layout";
import Uploader from "./components/Uploader";
import { useImageProcessing } from "./contexts/ImageProcessingContext/useImageProcessing";

const App = () => {
  const { images, processAllImages, isProcessing } = useImageProcessing();
  const [hasImages, setHasImages] = useState(false);

  // Update hasImages state when images array changes
  useEffect(() => {
    setHasImages(images.length > 0);
  }, [images]);

  return (
    <Layout>
      <div
        className={`w-full flex flex-col transition-all duration-500 items-center py-2 gap-4 ${
          !hasImages ? "justify-center h-full" : "justify-start"
        }`}
      >
        <AnimatePresence>
          {!hasImages && (
            <motion.div
              initial={{ opacity: 0, y: "-1.25rem" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "-3rem", height: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-2 mb-1.5"
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                Feed the{" "}
                <motion.span
                  className="text-primary font-bold"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  Monster
                </motion.span>{" "}
                an <span className="text-primary">Image</span>
              </h1>
              <p className="text-base-content/70 max-w-2xl mx-auto">
                Upload images and our AI monster will remove their backgrounds.
                All processing happens directly in your browser!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            height: hasImages ? "9.375rem" : "16rem",
            marginBottom: hasImages ? "0.5rem" : "0",
          }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl mx-auto flex-shrink-0"
        >
          <Uploader />
        </motion.div>

        <AnimatePresence>
          {hasImages && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl flex-grow overflow-hidden bg-base-200 rounded-box my-4"
            >
              <div className="h-full max-h-[calc(100vh-15rem)] overflow-y-auto">
                <ImageList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hasImages && (
          <motion.button
            className="btn btn-primary fixed bottom-15 right-6 z-50 btn-circle w-10 h-10 md:w-14 md:h-14 shadow-lg"
            onClick={processAllImages}
            disabled={isProcessing}
            initial={{ opacity: 0, y: "1.25rem" }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isProcessing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            )}
          </motion.button>
        )}
      </div>
    </Layout>
  );
};

export default App;
