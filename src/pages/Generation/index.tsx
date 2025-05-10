// src/pages/Generation/index.tsx

import { BsCloudDownload } from "react-icons/bs";
import { CiPlay1 } from "react-icons/ci";
import GenerationSettings from "./components/GenerationSettings";
import ImageGrid from "./components/ImageGrid";
import Input from "./components/Input";
import JSZip from "jszip";
import Layout from "@/components/Layout";
import { MODELS } from "@/types/imageGeneration";
import { ModelInfo } from "@/components/ModelInfo";
import { saveAs } from "file-saver";
import { useImageGeneration } from "../../contexts/ImageGenerationContext/useImageGeneration";
import { useToast } from "../../contexts/ToastContext/useToast";

const Generation = () => {
  const {
    prompt,
    generatedImages,
    isGenerating,
    selectedModel,
    updateSelectedModel,
    generateImage,
  } = useImageGeneration();
  const { addToast } = useToast();

  const hasPrompt = !!prompt.trim();
  const hasGeneratedImages = generatedImages.length > 0;
  const shouldCollapse = hasGeneratedImages || isGenerating;

  // Function to download all images as a zip
  const downloadAllImages = () => {
    if (generatedImages.length === 0) {
      addToast("No images to download", "warning");
      return;
    }

    // If there's only one image, download it directly
    if (generatedImages.length === 1) {
      const image = generatedImages[0];
      const filename = `image-monster-${image.prompt
        .slice(0, 20)
        .replace(/[^a-z0-9]/gi, "-")}.png`;

      fetch(image.imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          saveAs(blob, filename);
        });
      return;
    }

    // Otherwise create a zip with all images
    const zip = new JSZip();
    const promises: Promise<void>[] = [];

    // Add each generated image to the zip
    generatedImages.forEach((image) => {
      const promise = fetch(image.imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          // Create a filename based on the prompt
          const filename = `image-monster-${image.prompt
            .slice(0, 20)
            .replace(/[^a-z0-9]/gi, "-")}.png`;
          zip.file(filename, blob);
        });

      promises.push(promise);
    });

    // When all images are added to the zip, generate and download it
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "image-monster-generated.zip");
      });
    });
  };

  return (
    <Layout>
      <section
        className={`w-full flex flex-col transition-all duration-500 items-center gap-8 py-8 ${
          !shouldCollapse ? "justify-center h-full" : "justify-start"
        }`}
        aria-label="Image generation application"
      >
        {/* Title section - only show when no images */}
        {!shouldCollapse && (
          <div className="max-w-3xl text-center space-y-2 mb-1.5">
            <h1 className="text-4xl md:text-5xl font-bold">
              Ask the <span className="text-primary font-bold">Monster</span>{" "}
              for an <span className="text-primary">Image</span>
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Send a message to our monster and it will generate an image for
              you. It runs entirely in the browser, so no data is sent to a
              server.
            </p>
          </div>
        )}

        {/* Input section - adjusts height based on context */}
        <div
          className="w-full max-w-3xl mx-auto flex-shrink-0"
          style={{
            height: shouldCollapse ? "10rem" : "15rem",
            marginBottom: shouldCollapse ? "0.5rem" : "0",
          }}
          aria-label="Write your prompt here"
        >
          <Input />
        </div>

        {/* Options section - always visible */}
        <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
          <GenerationSettings />
          {!shouldCollapse && (
            <ModelInfo
              models={MODELS}
              selectedModel={selectedModel}
              updateSelectedModel={updateSelectedModel}
            />
          )}
        </div>

        {/* Gallery section - shows when there are images */}
        {shouldCollapse && (
          <div
            className="w-full max-w-3xl flex-grow overflow-hidden bg-base-200 rounded-box"
            aria-label="Generated images gallery"
          >
            <div className="h-full max-h-[calc(100vh-15rem)] overflow-y-auto">
              <ImageGrid />
            </div>
          </div>
        )}

        {/* Download and Generate buttons */}
        <div
          className="fixed bottom-15 right-6 z-10 flex flex-col items-center gap-2"
          role="group"
          aria-label="Image generation actions"
        >
          {/* Download all button - only show when there are images */}
          {hasGeneratedImages && !isGenerating && (
            <button
              className="btn btn-primary btn-outline btn-md btn-circle shadow-lg"
              onClick={downloadAllImages}
              aria-label={`Download ${
                generatedImages.length === 1
                  ? "generated image"
                  : "all generated images as ZIP"
              }`}
              tabIndex={0}
            >
              <BsCloudDownload className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          {/* Generate button */}
          {hasPrompt && !isGenerating && (
            <button
              className="btn btn-primary btn-circle btn-lg shadow-lg"
              onClick={() => generateImage()}
              aria-label="Generate image"
              tabIndex={0}
              disabled={isGenerating}
            >
              {isGenerating ? (
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

export default Generation;
