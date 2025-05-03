import { motion } from "framer-motion";

interface ResultPreviewProps {
  originalUrl: string;
  processedUrl: string;
}

export const ResultPreview = ({
  originalUrl,
  processedUrl,
}: ResultPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4"
    >
      <div className="rounded-lg overflow-hidden">
        <figure className="diff min-h-[50vh] h-full w-full" tabIndex={0}>
          <div className="diff-item-1" role="img" tabIndex={0}>
            <img alt="original" className="object-contain" src={originalUrl} />
          </div>
          <div className="diff-item-2" role="img" tabIndex={0}>
            <img
              alt="processed"
              className="object-contain"
              src={processedUrl}
            />
          </div>
          <div className="diff-resizer"></div>
        </figure>
      </div>
    </motion.div>
  );
};
