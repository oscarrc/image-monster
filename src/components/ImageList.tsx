import { IoCloseOutline, IoEyeOutline } from "react-icons/io5";
import { KeyboardEvent, useState } from "react";
import { MODELS, ProcessedImage } from "../types/imageProcessing";

import { AnimatePresence } from "framer-motion";
import { BsCloudDownload } from "react-icons/bs";
import { CiPlay1 } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import { ImageSettings } from "./ImageSettings";
import { Modal } from "./Modal";
import { ResultPreview } from "./ResultPreview";
import { useImageProcessing } from "../contexts/ImageProcessingContext/useImageProcessing";

export const ImageList = () => {
  const {
    images,
    processImageById,
    updateImageOptions,
    removeImage,
    selectedModel,
    updateSelectedModel,
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

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSelectedModel(e.target.value);
  };

  const handleKeyPress = (
    e: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>,
    action: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const statusClass = {
    pending: "text-base-content/70",
    processing: "text-secondary/70",
    completed: "text-primary/70",
    error: "text-error/70",
  };

  return (
    <>
      <ul
        className="list bg-base-200 rounded-box shadow-md w-full"
        role="list"
        aria-label="Uploaded images list"
      >
        <li className="p-4 sticky top-0 z-50 bg-base-200 text-xs tracking-wide flex justify-between">
          <span>Uploaded Images</span>
          <div className="flex gap-2 items-center">
            <label>Model: </label>
            <select
              className="select select-xs select-primary text-base-content/70"
              onChange={handleModelChange}
              value={selectedModel}
            >
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </li>

        {images.map((image: ProcessedImage) => (
          <li
            key={image.id}
            role="listitem"
            aria-label={`Image: ${image.name}, Status: ${image.status}`}
          >
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
                      <span
                        className="loading loading-spinner loading-sm text-primary"
                        aria-label="Processing"
                        role="status"
                      ></span>
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
                  aria-live="polite"
                >
                  {image.status}
                </div>
              </div>

              {image.status !== "completed" && (
                <button
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => processImageById(image.id)}
                  onKeyDown={(e) =>
                    handleKeyPress(e, () => processImageById(image.id))
                  }
                  disabled={image.status === "processing"}
                  aria-label={`Process image ${image.name}`}
                  tabIndex={0}
                >
                  <CiPlay1 className="h-5 w-5" aria-hidden="true" />
                </button>
              )}

              <button
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => toggleExpand(image.id)}
                onKeyDown={(e) =>
                  handleKeyPress(e, () => toggleExpand(image.id))
                }
                aria-label={`${
                  expandedImageId === image.id ? "Hide" : "Show"
                } settings for ${image.name}`}
                aria-expanded={expandedImageId === image.id}
                aria-controls={`settings-${image.id}`}
                tabIndex={0}
              >
                <GiSettingsKnobs className="h-5 w-5" aria-hidden="true" />
              </button>

              {image.status === "completed" && image.processedUrl && (
                <>
                  <button
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => openPreview(image)}
                    onKeyDown={(e) =>
                      handleKeyPress(e, () => openPreview(image))
                    }
                    aria-label={`Preview result for ${image.name}`}
                    tabIndex={0}
                  >
                    <IoEyeOutline className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <a
                    href={image.processedUrl}
                    download={`${image.name.split(".")[0]}_nobg.png`}
                    className="btn btn-square btn-ghost btn-sm"
                    aria-label={`Download processed image ${image.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        const link = document.createElement("a");
                        link.href = image.processedUrl as string;
                        link.download = `${image.name.split(".")[0]}_nobg.png`;
                        link.click();
                      }
                    }}
                  >
                    <BsCloudDownload className="h-5 w-5" aria-hidden="true" />
                  </a>
                </>
              )}

              <button
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => removeImage(image.id)}
                onKeyDown={(e) =>
                  handleKeyPress(e, () => removeImage(image.id))
                }
                aria-label={`Remove image ${image.name}`}
                tabIndex={0}
              >
                <IoCloseOutline className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <AnimatePresence>
              {expandedImageId === image.id && (
                <ImageSettings
                  imageId={image.id}
                  options={image.options}
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
                aria-label={`Download processed image ${previewImage.name}`}
                tabIndex={0}
              >
                Download
              </a>
              <button
                className="btn btn-sm btn-outline btn-primary"
                onClick={closePreview}
                onKeyDown={(e) => handleKeyPress(e, closePreview)}
                aria-label="Close preview"
                tabIndex={0}
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
