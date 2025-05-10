// src/pages/Generation/components/GenerationSettings.tsx

import { useImageGeneration } from "../../../contexts/ImageGenerationContext/useImageGeneration";

const GenerationSettings = () => {
  const { generationOptions, updateGenerationOptions } = useImageGeneration();

  return (
    <div className="w-full max-w-3xl mx-auto bg-base-200 rounded-box px-4">
      <div className="collapse collapse-arrow">
        <input type="checkbox" className="min-h-0" />
        <div className="collapse-title min-h-0 p-0 flex items-center">
          <h3 className="text-lg font-medium">Generation Options</h3>
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text">Temperature</span>
                <span className="label-text-alt">
                  {generationOptions.temperature}
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={generationOptions.temperature}
                onChange={(e) =>
                  updateGenerationOptions({
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="range range-xs range-primary"
              />
              <div className="label py-0">
                <span className="label-text-alt text-xs">More precise</span>
                <span className="label-text-alt text-xs">More creative</span>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text">Top-P</span>
                <span className="label-text-alt">{generationOptions.topP}</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={generationOptions.topP}
                onChange={(e) =>
                  updateGenerationOptions({
                    topP: parseFloat(e.target.value),
                  })
                }
                className="range range-xs range-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text">Top-K</span>
                <span className="label-text-alt">{generationOptions.topK}</span>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={generationOptions.topK}
                onChange={(e) =>
                  updateGenerationOptions({
                    topK: parseInt(e.target.value),
                  })
                }
                className="range range-xs range-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text">Repetition Penalty</span>
                <span className="label-text-alt">
                  {generationOptions.repetitionPenalty}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={generationOptions.repetitionPenalty}
                onChange={(e) =>
                  updateGenerationOptions({
                    repetitionPenalty: parseFloat(e.target.value),
                  })
                }
                className="range range-xs range-primary"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer py-1">
                <span className="label-text">Random Sampling</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={generationOptions.doSample}
                  onChange={(e) =>
                    updateGenerationOptions({
                      doSample: e.target.checked,
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationSettings;
