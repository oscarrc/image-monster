import { Options } from "../../../types/imageProcessing";

interface ImageSettingsProps {
  imageId: string;
  options: Options;
  isProcessing: boolean;
  updateImageOptions: (id: string, options: Partial<Options>) => void;
  processImage: (id: string) => Promise<void>;
}

export const ImageSettings = ({
  imageId,
  options,
  isProcessing,
  updateImageOptions,
  processImage,
}: ImageSettingsProps) => {
  return (
    <div className="list-col-wrap w-full p-4 rounded-lg space-y-4">
      <div className="flex flex-col gap-4">
        <label className="label cursor-pointer">
          <span className="label-text">Threshold</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={options.thresholdEnabled}
            onChange={(e) =>
              updateImageOptions(imageId, {
                thresholdEnabled: e.target.checked,
              })
            }
          />
        </label>
        {options.thresholdEnabled && (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={options.threshold}
              onChange={(e) =>
                updateImageOptions(imageId, {
                  threshold: parseFloat(e.target.value),
                })
              }
              className="range range-xs flex-grow"
            />
            <span className="text-xs w-8 text-right">{options.threshold}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label className="label cursor-pointer">
          <span className="label-text">Smoothing</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={options.smoothingEnabled}
            onChange={(e) =>
              updateImageOptions(imageId, {
                smoothingEnabled: e.target.checked,
              })
            }
          />
        </label>
        {options.smoothingEnabled && (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={options.smoothingRadius}
              onChange={(e) =>
                updateImageOptions(imageId, {
                  smoothingRadius: parseInt(e.target.value),
                })
              }
              className="range range-xs flex-grow"
            />
            <span className="text-xs w-8 text-right">
              {options.smoothingRadius}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label className="label cursor-pointer">
          <span className="label-text">Feathering</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={options.featherEnabled}
            onChange={(e) =>
              updateImageOptions(imageId, {
                featherEnabled: e.target.checked,
              })
            }
          />
        </label>
        {options.featherEnabled && (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={options.featherRadius}
              onChange={(e) =>
                updateImageOptions(imageId, {
                  featherRadius: parseInt(e.target.value),
                })
              }
              className="range range-xs flex-grow"
            />
            <span className="text-xs w-8 text-right">
              {options.featherRadius}
            </span>
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Preserve Edges</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={options.preserveEdges}
            onChange={(e) =>
              updateImageOptions(imageId, {
                preserveEdges: e.target.checked,
              })
            }
          />
        </label>
      </div>

      <button
        className="btn btn-sm btn-primary w-full"
        onClick={() => processImage(imageId)}
        disabled={isProcessing}
      >
        Apply Settings
      </button>
    </div>
  );
};
