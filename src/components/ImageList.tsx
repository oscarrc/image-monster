import { IoCloseOutline, IoEyeOutline } from "react-icons/io5";

import { AnimatePresence } from "framer-motion";
import { BsCloudDownload } from "react-icons/bs";
import { CiPlay1 } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import { ImageSettings } from "./ImageSettings";
import { Modal } from "./Modal";
import { ProcessedImage } from "../types/imageProcessing";
import { ResultPreview } from "./ResultPreview";
import { useImageProcessing } from "../contexts/ImageProcessingContext/useImageProcessing";
import { useState } from "react";

export const ImageList = () => {
  const {
    images,
    processImageById,
    updateImageOptions,
    removeImage,
    options,
    isProcessing,
  } = useImageProcessing();
  const [expandedImageId, setExpandedImageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProcessedImage | null>(null);

  if (images.length === 0) return null;

  const toggleExpand = (id: string) => {
    if (expandedImageId === id) {
      setExpandedImageId(null);
    } else {
      setExpandedImageId(id);
    }
  };

  const openPreview = (image: ProcessedImage) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const statusClass = {
    pending: "text-base-content/70",
    processing: "text-secondary/70",
    completed: "text-primary/70",
    error: "text-error/70",
  };

  return (
    <>
      <ul className="list bg-base-200 rounded-box shadow-md w-full">
        <li className="p-4 sticky top-0 z-50 bg-base-200 text-xs tracking-wide">
          Uploaded Images
        </li>

        {images.map((image: ProcessedImage) => (
          <li key={image.id}>
            <div className="list-row">
              <div>
                <div className="relative size-12 rounded-box overflow-hidden">
                  <img
                    className="size-full object-cover"
                    src={image.originalUrl}
                    alt={image.name}
                  />
                  {image.status === "processing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-300 bg-opacity-70">
                      <span className="loading loading-spinner loading-sm text-primary"></span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="font-medium truncate max-w-[200px]">
                  {image.name}
                </div>
                <div
                  className={`text-xs uppercase font-semibold ${
                    statusClass[image.status]
                  }`}
                >
                  {image.status}
                </div>
              </div>

              {image.status !== "completed" && (
                <button
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => processImageById(image.id)}
                  disabled={image.status === "processing"}
                  aria-label="Process image"
                >
                  <CiPlay1 className="h-5 w-5" />
                </button>
              )}

              <button
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => toggleExpand(image.id)}
                aria-label="Toggle settings"
              >
                <GiSettingsKnobs className="h-5 w-5" />
              </button>

              {image.status === "completed" && image.processedUrl && (
                <>
                  <button
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => openPreview(image)}
                    aria-label="Preview result"
                  >
                    <IoEyeOutline className="h-5 w-5" />
                  </button>

                  <a
                    href={image.processedUrl}
                    download={`${image.name.split(".")[0]}_nobg.png`}
                    className="btn btn-square btn-ghost btn-sm"
                    aria-label="Download processed image"
                  >
                    <BsCloudDownload className="h-5 w-5" />
                  </a>
                </>
              )}

              <button
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => removeImage(image.id)}
                aria-label="Remove image"
              >
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence>
              {expandedImageId === image.id && (
                <ImageSettings
                  imageId={image.id}
                  options={options}
                  isProcessing={isProcessing}
                  updateImageOptions={updateImageOptions}
                  processImage={processImageById}
                />
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={previewImage !== null}
        onClose={closePreview}
        title={`${previewImage?.name}`}
        size="xl"
      >
        {previewImage?.processedUrl && (
          <>
            <ResultPreview
              originalUrl={previewImage.originalUrl}
              processedUrl={previewImage.processedUrl}
            />
            <div className="px-4 pb-4 flex justify-end gap-2">
              <a
                href={previewImage.processedUrl}
                download={`${previewImage.name.split(".")[0]}_nobg.png`}
                className="btn btn-sm btn-primary"
              >
                Download
              </a>
              <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={closePreview}
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
