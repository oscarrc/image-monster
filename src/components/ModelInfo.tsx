import { useImageProcessing } from "../contexts/ImageProcessingContext/useImageProcessing";

export const ModelInfo = () => {
  const { selectedModel, updateSelectedModel } = useImageProcessing();

  const handleModelSelect = (modelName: string) => {
    updateSelectedModel(modelName);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-base-200 rounded-box p-4">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">Available Models</h3>      
      <div className="space-y-4">
        {/* RMBG-1.4 Model */}
        <div 
          className={`collapse collapse-arrow bg-base-100 rounded-lg border ${
            selectedModel === "RMGB-1.4" ? "border-primary" : "border-base-300"
          }`}
        >
          <input type="checkbox" defaultChecked={false} />
          <div 
            className={`collapse-title font-medium cursor-pointer ${
              selectedModel === "RMGB-1.4" ? "text-primary" : ""
            }`}
            onClick={() => handleModelSelect("RMGB-1.4")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>RMBG-1.4 (BRIA AI)</span>
                {selectedModel === "RMGB-1.4" && (
                  <span className="badge badge-sm badge-primary">Selected</span>
                )}
              </div>
              <div className="text-xs text-base-content/70">~175MB</div>
            </div>
          </div>
          <div className="collapse-content">
            <p className="text-sm text-base-content/70 mb-3">
              BRIA's Background Removal model is a professional-grade, state-of-the-art segmentation model 
              trained on a diverse, high-quality dataset.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/60 mb-3">
              <span>✓ Higher accuracy</span>
              <span>✓ Larger model (44.1MB)</span>
              <span>✓ Better for complex images</span>
            </div>
            <div className="flex justify-between items-center">
              <a 
                href="https://huggingface.co/briaai/RMBG-1.4" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs link text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                View on Hugging Face
              </a>
              
              <button 
                className={`btn btn-xs ${selectedModel === "RMGB-1.4" ? "btn-disabled" : "btn-primary"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModelSelect("RMGB-1.4");
                }}
                disabled={selectedModel === "RMGB-1.4"}
              >
                {selectedModel === "RMGB-1.4" ? "Selected" : "Select Model"}
              </button>
            </div>
          </div>
        </div>
        {/* MODNet Model */}
        <div 
          className={`collapse collapse-arrow bg-base-100 rounded-lg border ${
            selectedModel === "modnet" ? "border-primary" : "border-base-300"
          }`}
        >
          <input type="checkbox" defaultChecked={false} /> 
          <div 
            className={`collapse-title font-medium cursor-pointer ${
              selectedModel === "modnet" ? "text-primary" : ""
            }`}
            onClick={() => handleModelSelect("modnet")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>MODNet (Xenova)</span>
                {selectedModel === "modnet" && (
                  <span className="badge badge-sm badge-primary">Selected</span>
                )}
              </div>
              <div className="text-xs text-base-content/70">~25MB</div>
            </div>
          </div>
          <div className="collapse-content">
            <p className="text-sm text-base-content/70 mb-3">
              MODNet is a fast, lightweight model for portrait matting that works in real-time. 
              It uses a trimap-free approach for background removal.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/60 mb-3">
              <span>✓ Fast processing</span>
              <span>✓ Smaller size (20MB)</span>
              <span>✓ Optimized for portraits</span>
            </div>
            <div className="flex justify-between items-center">
              <a 
                href="https://huggingface.co/Xenova/modnet" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs link text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                View on Hugging Face
              </a>
              
              <button 
                className={`btn btn-xs ${selectedModel === "modnet" ? "btn-disabled" : "btn-primary"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModelSelect("modnet");
                }}
                disabled={selectedModel === "modnet"}
              >
                {selectedModel === "modnet" ? "Selected" : "Select Model"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 