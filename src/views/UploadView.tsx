import Uploader from "@/components/Uploader";
import { motion } from "framer-motion";

const UploadView = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full gap-8 py-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center space-y-2"
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
          Upload an image and our AI monster will process it with magical
          transformations. All processing happens directly in your browser!
        </p>
      </motion.div>
      <Uploader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center space-y-2"
      >
        <div className="stats stats-vertical sm:stats-horizontal">
          <div className="stat">
            <div className="stat-value">
              Background
              <br />
              <span className="text-primary">Removal</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-value text-base-content/70 hover:text-primary">
              Image
              <br />
              <span className="text-primary">Enhacement</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-value text-base-content/70 hover:text-primary">
              Style
              <br />
              <span className="text-primary">Transfer</span>
            </div>
          </div>
        </div>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          No sign-up required. Just upload your image and let the monster do the
          rest!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UploadView;
