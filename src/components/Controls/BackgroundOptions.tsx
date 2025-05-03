import { MODES } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const BackgroundOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleToggle = (key: keyof (typeof options)[MODES.BACKGROUND]) => {
    updateOptions(MODES.BACKGROUND, {
      ...options[MODES.BACKGROUND],
      [key]: !options[MODES.BACKGROUND][key],
    });
  };

  const handleSliderChange = (
    key: keyof (typeof options)[MODES.BACKGROUND],
    value: number
  ) => {
    updateOptions(MODES.BACKGROUND, {
      ...options[MODES.BACKGROUND],
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Threshold Controls */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={options[MODES.BACKGROUND].thresholdEnabled}
            onChange={() => handleToggle("thresholdEnabled")}
          />
          <span className="label-text">Enable Threshold</span>
        </label>
        {options[MODES.BACKGROUND].thresholdEnabled && (
          <div className="mt-2">
            <label className="label flex justify-between">
              <span className="label-text">Threshold Level</span>
              <span className="label-text font-bold">
                {options[MODES.BACKGROUND].threshold}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={options[MODES.BACKGROUND].threshold}
              onChange={(e) =>
                handleSliderChange("threshold", parseFloat(e.target.value))
              }
              className="range range-primary range-xs w-full"
            />
          </div>
        )}
      </div>

      {/* Smoothing Controls */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={options[MODES.BACKGROUND].smoothingEnabled}
            onChange={() => handleToggle("smoothingEnabled")}
          />
          <span className="label-text">Enable Smoothing</span>
        </label>
        {options[MODES.BACKGROUND].smoothingEnabled && (
          <div className="mt-2">
            <label className="label flex justify-between">
              <span className="label-text">Smoothing Radius</span>
              <span className="label-text font-bold">
                {options[MODES.BACKGROUND].smoothingRadius}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={options[MODES.BACKGROUND].smoothingRadius}
              onChange={(e) =>
                handleSliderChange("smoothingRadius", parseInt(e.target.value))
              }
              className="range range-primary range-xs w-full"
            />
          </div>
        )}
      </div>

      {/* Feathering Controls */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={options[MODES.BACKGROUND].featherEnabled}
            onChange={() => handleToggle("featherEnabled")}
          />
          <span className="label-text">Enable Feathering</span>
        </label>
        {options[MODES.BACKGROUND].featherEnabled && (
          <div className="mt-2">
            <label className="label flex justify-between">
              <span className="label-text">Feathering Radius</span>
              <span className="label-text font-bold">
                {options[MODES.BACKGROUND].featherRadius}
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={options[MODES.BACKGROUND].featherRadius}
              onChange={(e) =>
                handleSliderChange("featherRadius", parseInt(e.target.value))
              }
              className="range range-primary range-xs w-full"
            />
          </div>
        )}
      </div>

      {/* Edge Preservation */}
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={options[MODES.BACKGROUND].preserveEdges}
            onChange={() => handleToggle("preserveEdges")}
          />
          <span className="label-text">Preserve Edges</span>
        </label>
      </div>
    </div>
  );
};

export default BackgroundOptions;
