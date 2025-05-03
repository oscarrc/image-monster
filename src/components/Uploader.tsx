import { useRef, useState, KeyboardEvent } from "react";

import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";
import { useImageProcessing } from "../contexts/ImageProcessingContext/useImageProcessing";

const Uploader = () => {
  const { addImages, images } = useImageProcessing();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImages = images.length > 0;

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleButtonClick();
    }
  };

  return (
    <div
      className={`w-full h-full border-4 ${
        isDragging
          ? "border-primary bg-primary/10"
          : "border-dashed border-base-content/70"
      } rounded-xl p-6 transition-all duration-300 ease-in-out flex items-center justify-center`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="region"
      aria-label="File upload area"
    >
      <motion.div
        className="flex flex-col items-center gap-4 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={handleButtonClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={hasImages ? "Upload more images" : "Upload images"}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          aria-hidden="true"
        >
          <FiUploadCloud className={`${hasImages ? 'w-12 h-12' : 'w-16 h-16'} text-primary transition-all duration-300`} />
        </motion.div>
        <div className="text-center">
          <h3 className={`${hasImages ? 'text-lg' : 'text-xl'} mb-2 transition-all duration-300`}>
            {hasImages ? 'Upload More Images' : 'Drag & Drop or Click to Upload'}
          </h3>
          {!hasImages && (
            <p className="text-base-content/60">
              Support for JPG, PNG, WebP up to 10MB. Multiple files allowed.
            </p>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </motion.div>
    </div>
  );
};

export default Uploader;
