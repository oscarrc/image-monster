import { KeyboardEvent, useRef, useState } from "react";

import { BsCloudUpload } from "react-icons/bs";
import { motion } from "framer-motion";
import { useImageProcessing } from "../../../contexts/ImageProcessingContext/useImageProcessing";
import { useToast } from "../../../contexts/ToastContext/useToast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const Uploader = () => {
  const { addImages, images } = useImageProcessing();
  const { addToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImages = images.length > 0;

  const validateAndAddFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        addToast(`${file.name} is not a supported image format`, "error");
        return false;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        addToast(`${file.name} exceeds the 10MB size limit`, "error");
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      // Create a new FileList-like object with only valid files
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));
      addImages(dataTransfer.files);
    }
  };

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
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
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
          <BsCloudUpload
            className={`${
              hasImages ? "w-12 h-12" : "w-16 h-16"
            } text-primary transition-all duration-300`}
          />
        </motion.div>
        <div className="text-center">
          <h3
            className={`${
              hasImages ? "text-lg" : "text-xl"
            } mb-2 transition-all duration-300`}
          >
            {hasImages
              ? "Upload More Images"
              : "Drag & Drop or Click to Upload"}
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
