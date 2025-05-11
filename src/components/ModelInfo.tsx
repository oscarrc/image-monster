import { MODELS } from "../types/imageProcessing";
import { useImageProcessing } from "../contexts/ImageProcessingContext/useImageProcessing";

export const ModelInfo = () => {
  const { selectedModel, updateSelectedModel } = useImageProcessing();

  const handleModelSelect = (modelId: string) => {
    updateSelectedModel(modelId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-base-200 rounded-box p-4">
      <h3 className="text-lg font-medium border-b pb-2 mb-4">
        Available Models
      </h3>
      <div className="space-y-4">
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;

          return (
            <div
              key={model.id}
              className={`collapse collapse-arrow bg-base-100 rounded-lg border ${
                isSelected ? "border-primary" : "border-base-300"
              }`}
            >
              <input type="radio" defaultChecked={false} name="models" />
              <div
                className={`collapse-title font-medium cursor-pointer ${
                  isSelected ? "text-primary" : ""
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="grid grid-cols-5 items-center gap-4">
                  <div className="flex items-center gap-2 col-span-4 text-right">
                    <div className="truncate">
                      {model.name} ({model.creator})
                    </div>
                    {isSelected && (
                      <span className="badge badge-sm badge-primary">
                        Selected
                      </span>
                    )}
                    {!isSelected && model.recommended && (
                      <span className="badge badge-sm badge-primary badge-outline">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-base-content/70 text-right">
                    {model.size}
                  </div>
                </div>
              </div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/70 mb-3">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/60 mb-3">
                  {model.features.map((feature, index) => (
                    <span key={index}>✓ {feature}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <a
                    href={`https://huggingface.co/${model.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs link text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Hugging Face
                  </a>

                  <button
                    className={`btn btn-xs ${
                      isSelected ? "btn-disabled" : "btn-primary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModelSelect(model.id);
                    }}
                    disabled={isSelected}
                  >
                    {isSelected ? "Selected" : "Select Model"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
