import { useRef, useState } from "react";

import { FiUploadCloud } from "react-icons/fi";
import { motion } from "framer-motion";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";
import { useNavigate } from "react-router-dom";

const Uploader = () => {
  const navigate = useNavigate();
  const { setImage } = useImageProcessing();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file!");
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large! Please select an image under 10MB.");
      return;
    }

    // Create URL for the image
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        // Navigate to process view
        navigate("/process");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl h-64 mx-auto"
    >
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
      >
        <motion.div
          className="flex flex-col items-center gap-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={handleButtonClick}
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
          >
            <FiUploadCloud className="w-16 h-16 text-primary" />
          </motion.div>
          <div className="text-center">
            <h3 className="text-xl mb-2">Drag & Drop or Click to Upload</h3>
            <p className="text-base-content/60">
              Support for JPG, PNG, WebP up to 10MB
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Uploader;
