import { MODELS, ProcessedImage } from "@/types/imageProcessing";

import { BsCloudDownload } from "react-icons/bs";
import { CiPlay1 } from "react-icons/ci";
import { ImageList } from "@/pages/Background/components/ImageList";
import JSZip from "jszip";
import Layout from "@/components/Layout";
import { ModelInfo } from "@/components/ModelInfo";
import Uploader from "@/pages/Background/components/Uploader";
import { saveAs } from "file-saver";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";
import { useToast } from "@/contexts/ToastContext/useToast";

const Background = () => {
  const { images, processAllImages, isProcessing, hasProcessedImages } =
    useImageProcessing();
  const { addToast } = useToast();

  const hasImages = images.length > 0;

  const downloadImages = () => {
    // Check if there are processed images
    const processedImages = images.filter(
      (img): img is ProcessedImage & { processedUrl: string } =>
        img.status === "completed" && img.processedUrl !== null
    );

    if (processedImages.length === 0) {
      // Show a toast notification instead of an alert
      addToast(
        "No processed images to download. Please process images first.",
        "warning"
      );
      return;
    }

    // If there's only one image, download it directly
    if (processedImages.length === 1) {
      const image = processedImages[0];
      const filename = `${image.name.split(".")[0]}_nobg.png`;

      fetch(image.processedUrl)
        .then((response) => response.blob())
        .then((blob) => {
          saveAs(blob, filename);
        });
      return;
    }

    // Otherwise create a zip with all images
    const zip = new JSZip();
    const promises: Promise<void>[] = [];

    // Add each processed image to the zip
    processedImages.forEach((image) => {
      const promise = fetch(image.processedUrl)
        .then((response) => response.blob())
        .then((blob) => {
          // Use the original filename but add _nobg.png
          const filename = `${image.name.split(".")[0]}_nobg.png`;
          zip.file(filename, blob);
        });

      promises.push(promise);
    });

    // When all images are added to the zip, generate and download it
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "image-monster-processed.zip");
      });
    });
  };

  return (
    <Layout>
      <section
        className={`w-full flex flex-col transition-all duration-500 items-center gap-8 py-8 ${
          !hasImages ? "justify-center h-full" : "justify-start"
        }`}
        aria-label="Image background removal application"
      >
        {!hasImages && (
          <div className="max-w-3xl text-center space-y-2 mb-1.5">
            <h1 className="text-4xl md:text-5xl font-bold">
              Feed the <span className="text-primary font-bold">Monster</span>{" "}
              an <span className="text-primary">Image</span>
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Upload images and our AI monster will remove their backgrounds.
              All processing happens directly in your browser!
            </p>
          </div>
        )}

        <div
          className="w-full max-w-3xl mx-auto flex-shrink-0"
          style={{
            height: hasImages ? "10rem" : "15rem",
            marginBottom: hasImages ? "0.5rem" : "0",
          }}
          aria-label="Image upload area"
        >
          <Uploader />
        </div>

        {!hasImages && (
          <div>
            <ModelInfo models={MODELS} />
          </div>
        )}

        {hasImages && (
          <div
            className="w-full max-w-3xl flex-grow overflow-hidden bg-base-200 rounded-box"
            aria-label="Uploaded images list"
          >
            <div className="h-full max-h-[calc(100vh-15rem)] overflow-y-auto">
              <ImageList />
            </div>
          </div>
        )}

        <div
          className="fixed bottom-15 right-6 z-10 flex flex-col items-center gap-2"
          role="group"
          aria-label="Image processing actions"
        >
          {hasProcessedImages && !isProcessing && (
            <button
              className="btn btn-primary btn-outline btn-md btn-circle shadow-lg"
              onClick={downloadImages}
              aria-label={`Download ${
                images.filter((img) => img.status === "completed").length === 1
                  ? "processed image"
                  : "all processed images as ZIP"
              }`}
              tabIndex={0}
            >
              <BsCloudDownload className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {hasImages && (
            <button
              className="btn btn-primary btn-circle btn-lg shadow-lg"
              onClick={processAllImages}
              aria-label="Process all images"
              tabIndex={0}
            >
              {isProcessing ? (
                <span
                  className="loading loading-spinner"
                  aria-hidden="true"
                ></span>
              ) : (
                <CiPlay1 className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Background;
