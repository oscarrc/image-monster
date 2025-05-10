// src/pages/Generation/components/ImageGrid.tsx

import { BsCloudDownload, BsEye, BsTrash } from "react-icons/bs";

import { GeneratedImage } from "@/types/imageGeneration";
import ImageDetail from "./ImageDetail";
import { KeyboardEvent } from "react";
import { Modal } from "../../../components/Modal";
import { useImageGeneration } from "../../../contexts/ImageGenerationContext/useImageGeneration";
import { useState } from "react";

const ImageGrid = () => {
  const { generatedImages, removeGeneratedImage, isGenerating, modelLoading } =
    useImageGeneration();

  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );

  const handleKeyPress = (
    e: KeyboardEvent<HTMLImageElement>,
    action: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-monster-${prompt
      .slice(0, 20)
      .replace(/[^a-z0-9]/gi, "-")}.png`;
    link.click();
  };

  const openImageModal = (image: GeneratedImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Don't show anything if there are no images and nothing is loading
  if (generatedImages.length === 0 && !isGenerating && !modelLoading) {
    return null;
  }

  const isLoading = isGenerating || modelLoading;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3 className="text-lg font-medium mb-4">Generated Images</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {generatedImages.map((image) => (
          <div
            key={image.id}
            className="relative bg-base-200 shadow-md rounded-box overflow-hidden group"
          >
            {/* Square aspect ratio container */}
            <div className="aspect-square">
              <img
                src={image.imageUrl}
                alt={`Generated from prompt: ${image.prompt}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openImageModal(image)}
                onKeyDown={(e) =>
                  handleKeyPress(e, () => openImageModal(image))
                }
                tabIndex={0}
                role="button"
                aria-label="View image"
              />

              {/* Overlay with actions on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="text-white text-xs line-clamp-3 overflow-hidden">
                  {image.prompt}
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                  <button
                    className="btn btn-circle btn-ghost btn-xs text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGeneratedImage(image.id);
                    }}
                    aria-label="Delete image"
                  >
                    <BsTrash className="h-4 w-4" />
                  </button>

                  <button
                    className="btn btn-circle btn-ghost btn-xs text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(image);
                    }}
                    aria-label="View image"
                  >
                    <BsEye className="h-4 w-4" />
                  </button>

                  <button
                    className="btn btn-circle btn-ghost btn-xs text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image.imageUrl, image.prompt);
                    }}
                    aria-label="Download image"
                  >
                    <BsCloudDownload className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading placeholder */}
        {isLoading && (
          <div className="relative bg-neutral shadow-md rounded-box overflow-hidden group">
            <div className="aspect-square flex items-center justify-center bg-base-300/50">
              <div className="flex flex-col items-center gap-2">
                <span
                  className="loading loading-spinner loading-lg text-primary"
                  aria-label="Generating image"
                  role="status"
                ></span>
                <span className="text-xs text-base-content/70">
                  {isGenerating ? "Generating image..." : "Loading model..."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={closeImageModal}
        title={selectedImage ? "Image Details" : ""}
        size="xl"
      >
        {selectedImage && (
          <ImageDetail
            image={selectedImage}
            onDownload={downloadImage}
            onClose={closeImageModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ImageGrid;
