import { useNavigate } from "react-router-dom";
import { MODES } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const Controls = () => {
  const { mode, setMode, isProcessing, processImage, image, setProcessedImage } = useImageProcessing();
  const navigate = useNavigate();

  if (!image) return null;

  const handleBack = () => {
    setProcessedImage(null);
    navigate("/");
  };

  const handleProcess = async () => {
    if (!image) return;
    const result = await processImage(mode, image);
    setProcessedImage(result);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <button
          className="btn btn-ghost"
          onClick={handleBack}
        >
          <span className="text-xl">←</span>
          Back
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            className={`btn ${mode === MODES.BACKGROUND ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode(MODES.BACKGROUND)}
          >
            Background
          </button>
          <button
            className={`btn ${mode === MODES.ENHANCE ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode(MODES.ENHANCE)}
          >
            Enhance
          </button>
          <button
            className={`btn ${mode === MODES.STYLE ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode(MODES.STYLE)}
          >
            Style
          </button>
          <button
            className={`btn ${mode === MODES.SEGMENT ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setMode(MODES.SEGMENT)}
          >
            Segment
          </button>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process"}
        </button>
      </div>
    </div>
  );
};

export default Controls;
