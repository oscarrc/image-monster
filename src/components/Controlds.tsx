import { FiArrowLeft, FiInfo } from "react-icons/fi";

import { RawImage } from "@huggingface/transformers";
import { motion } from "framer-motion";
import { useImageContext } from "@/contexts/ImageContext/useImageContext";
import { useNavigate } from "react-router-dom";
import { useTransformerModel } from "@/hooks/useTransformerModel";

const Controls = () => {
  const { image, resetImage, processedImage, setProcessedImage } =
    useImageContext();

  const navigate = useNavigate();

  const handleBack = () => {
    resetImage();
    navigate("/");
  };

  // Initialize model hooks for different processing options
  const backgroundRemoval = useTransformerModel(
    "background-removal",
    "Xenova/modnet"
  );
  const imageEnhancement = useTransformerModel(
    "image-to-image",
    "Xenova/4x_APISR_GRL_GAN_generator-onnx"
  );
  const styleTransfer = useTransformerModel(
    "image-to-image",
    "Xenova/arbitrary-style-transfer"
  );
  const objectDetection = useTransformerModel(
    "object-detection",
    "Xenova/detr-resnet-50"
  );

  // Get the current model based on selected option
  const getCurrentModel = () => {
    switch (processingOption) {
      case "background":
        return backgroundRemoval;
      case "enhance":
        return imageEnhancement;
      case "style":
        return styleTransfer;
      case "segment":
        return objectDetection;
      default:
        return backgroundRemoval;
    }
  };

  // Process the image
  const processImage = async () => {
    if (!image || isProcessing) return;

    setIsProcessing(true);
    setProcessedImage(null);

    try {
      const currentModel = getCurrentModel();

      // Load the model if not already loaded
      if (!currentModel.model) {
        await currentModel.loadModel();
      }

      switch (processingOption) {
        case "background":
          await processBackgroundRemoval();
          break;
        case "enhance":
          await processEnhancement();
          break;
        case "style":
          await processStyleTransfer();
          break;
        case "segment":
          await processObjectDetection();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("An error occurred while processing the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Background removal processing
  const processBackgroundRemoval = async () => {
    try {
      const img = await RawImage.fromURL(image!);

      const result = await backgroundRemoval.model(img, {
        threshold: 0.5,
        mask_background: true,
      });

      setProcessedImage(result[0].mask);
    } catch (error) {
      console.error("Error during background removal:", error);
      throw error;
    }
  };

  // Image enhancement processing
  const processEnhancement = async () => {
    try {
      let processedImg = new Image();
      processedImg.src = image!;

      await new Promise((resolve) => {
        processedImg.onload = resolve;
      });

      // Apply zoom if enabled
      if (enhanceSettings.zoomEnabled) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = processedImg.width;
        canvas.height = processedImg.height;

        const zoomFactor = enhanceSettings.zoomLevel / 100;
        const cropWidth = processedImg.width * zoomFactor;
        const cropHeight = processedImg.height * zoomFactor;
        const cropX = (processedImg.width - cropWidth) / 2;
        const cropY = (processedImg.height - cropHeight) / 2;

        ctx?.drawImage(
          processedImg,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const zoomedImg = new Image();
        zoomedImg.src = canvas.toDataURL("image/png");

        await new Promise((resolve) => {
          zoomedImg.onload = resolve;
        });

        processedImg = zoomedImg;
      }

      // Process with model
      const enhancedResult = await imageEnhancement.model(processedImg);

      // Apply scaling if needed
      if (enhanceSettings.scale !== 1.0) {
        const enhancedImg = new Image();
        enhancedImg.src = enhancedResult;

        await new Promise((resolve) => {
          enhancedImg.onload = resolve;
        });

        const scaledCanvas = document.createElement("canvas");
        const scaledCtx = scaledCanvas.getContext("2d");

        scaledCanvas.width = enhancedImg.width * enhanceSettings.scale;
        scaledCanvas.height = enhancedImg.height * enhanceSettings.scale;

        if (scaledCtx) {
          scaledCtx.imageSmoothingEnabled = true;
          scaledCtx.imageSmoothingQuality = "high";

          scaledCtx.drawImage(
            enhancedImg,
            0,
            0,
            scaledCanvas.width,
            scaledCanvas.height
          );
        }

        setProcessedImage(scaledCanvas.toDataURL("image/png"));
      } else {
        setProcessedImage(enhancedResult);
      }
    } catch (error) {
      console.error("Error during image enhancement:", error);
      throw error;
    }
  };

  // Style transfer processing
  const processStyleTransfer = async () => {
    try {
      const styleImg = new Image();
      styleImg.crossOrigin = "Anonymous";
      styleImg.src =
        "https://storage.googleapis.com/download.tensorflow.org/example_images/Vassily_Kandinsky%2C_1913_-_Composition_7.jpg";

      await new Promise((resolve, reject) => {
        styleImg.onload = resolve;
        styleImg.onerror = reject;
      });

      const contentImg = new Image();
      contentImg.src = image!;

      await new Promise((resolve) => {
        contentImg.onload = resolve;
      });

      const result = await styleTransfer.model({
        content_image: contentImg,
        style_image: styleImg,
        strength: styleSettings.styleStrength,
      });

      setProcessedImage(result);
    } catch (error) {
      console.error("Error during style transfer:", error);
      throw error;
    }
  };

  // Object detection processing
  const processObjectDetection = async () => {
    try {
      const img = new Image();
      img.src = image!;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const detections = await objectDetection.model(img, {
        threshold: 0.5,
        percentage: true,
      });

      // Create canvas to draw the detection results
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw original image
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes and labels
      if (ctx) {
        detections.forEach(
          (detection: {
            box: [number, number, number, number];
            label: string;
            score: number;
          }) => {
            const [x, y, width, height] = detection.box;

            // Convert percentage to pixels
            const boxX = x * canvas.width;
            const boxY = y * canvas.height;
            const boxWidth = width * canvas.width;
            const boxHeight = height * canvas.height;

            // Draw rectangle
            ctx.strokeStyle = "#83fc00";
            ctx.lineWidth = 3;
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

            // Draw background for label
            ctx.fillStyle = "#83fc00";
            const label = `${detection.label} (${Math.round(
              detection.score * 100
            )}%)`;
            const textWidth = ctx.measureText(label).width + 6;
            ctx.fillRect(
              boxX,
              boxY > 20 ? boxY - 24 : boxY + boxHeight,
              textWidth,
              24
            );

            // Draw label
            ctx.fillStyle = "#000000";
            ctx.font = "16px Arial";
            ctx.fillText(
              label,
              boxX + 3,
              boxY > 20 ? boxY - 8 : boxY + boxHeight + 16
            );
          }
        );
      }

      setProcessedImage(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Error during object detection:", error);
      throw error;
    }
  };

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col"
    >
      <div className="bg-base-200 rounded-lg p-4 flex flex-col h-full w-full gap-4">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="btn btn-circle btn-ghost">
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-semibold">Choose Processing Option</h3>
        </div>
        <div className="tabs tabs-border">
          <a
            className={`tab flex-1 ${
              processingOption === "background" ? "tab-active" : ""
            }`}
            onClick={() => setProcessingOption("background")}
          >
            Remove Background
          </a>
          <a
            className={`tab flex-1 ${
              processingOption === "enhance" ? "tab-active" : ""
            }`}
            onClick={() => setProcessingOption("enhance")}
          >
            Enhance
          </a>
          <a
            className={`tab flex-1 ${
              processingOption === "style" ? "tab-active" : ""
            }`}
            onClick={() => setProcessingOption("style")}
          >
            Style Transfer
          </a>
          <a
            className={`tab flex-1 ${
              processingOption === "segment" ? "tab-active" : ""
            }`}
            onClick={() => setProcessingOption("segment")}
          >
            Object Detection
          </a>
        </div>

        <div className="space-y-4 flex flex-col flex-1">
          {/* Enhancement settings */}
          {processingOption === "enhance" && (
            <div className="space-y-3">
              <div>
                <label className="label">
                  <span className="label-text">
                    Scale Factor: {enhanceSettings.scale}x
                  </span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={enhanceSettings.scale}
                  onChange={(e) =>
                    setEnhanceSettings({
                      ...enhanceSettings,
                      scale: parseFloat(e.target.value),
                    })
                  }
                  className="range range-primary range-sm"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Zoom Center</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={enhanceSettings.zoomEnabled}
                    onChange={(e) =>
                      setEnhanceSettings({
                        ...enhanceSettings,
                        zoomEnabled: e.target.checked,
                      })
                    }
                  />
                </label>
              </div>

              {enhanceSettings.zoomEnabled && (
                <div>
                  <label className="label">
                    <span className="label-text">
                      Zoom Level: {enhanceSettings.zoomLevel}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={enhanceSettings.zoomLevel}
                    onChange={(e) =>
                      setEnhanceSettings({
                        ...enhanceSettings,
                        zoomLevel: parseInt(e.target.value),
                      })
                    }
                    className="range range-primary range-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Style transfer settings */}
          {processingOption === "style" && (
            <div>
              <label className="label">
                <span className="label-text">
                  Style Strength: {styleSettings.styleStrength}
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={styleSettings.styleStrength}
                onChange={(e) =>
                  setStyleSettings({
                    ...styleSettings,
                    styleStrength: parseFloat(e.target.value),
                  })
                }
                className="range range-primary range-sm"
              />
            </div>
          )}

          {/* Info message based on option */}
          <div className="alert border border-primary text-primary mt-auto">
            <FiInfo className="w-5 h-5" />
            <span>
              {processingOption === "background" &&
                "This will remove the background from your image, keeping only the main subject."}
              {processingOption === "enhance" &&
                "This will enhance the details and quality of your image with AI upscaling."}
              {processingOption === "style" &&
                "This will apply an artistic style (Kandinsky) to your image."}
              {processingOption === "segment" &&
                "This will detect and identify objects in your image."}
            </span>
          </div>
        </div>
        {!processedImage ? (
          <button
            className="btn btn-primary btn-block"
            onClick={processImage}
            disabled={isProcessing}
          >
            {isProcessing && <span className="loading loading-spinner"></span>}
            {isProcessing ? "Processing..." : "Process Image"}
          </button>
        ) : (
          <button
            className="btn btn-outline btn-block btn-primary"
            onClick={() => setProcessedImage(null)}
          >
            Try Another Effect
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Controls;
