import { MODES } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const EnhanceOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleToggle = (key: keyof typeof options[MODES.ENHANCE]) => {
    updateOptions(MODES.ENHANCE, {
      ...options[MODES.ENHANCE],
      [key]: !options[MODES.ENHANCE][key],
    });
  };

  const handleSliderChange = (
    key: keyof typeof options[MODES.ENHANCE],
    value: number
  ) => {
    updateOptions(MODES.ENHANCE, {
      ...options[MODES.ENHANCE],
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label flex justify-between">
          <span className="label-text">Scale</span>
          <span className="label-text font-bold">
            {options[MODES.ENHANCE].scale}x
          </span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={options[MODES.ENHANCE].scale}
          onChange={(e) => handleSliderChange("scale", parseFloat(e.target.value))}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            checked={options[MODES.ENHANCE].zoomEnabled}
            onChange={() => handleToggle("zoomEnabled")}
            className="checkbox checkbox-primary"
          />
          <span className="label-text">Enable Zoom</span>
        </label>
      </div>
      {options[MODES.ENHANCE].zoomEnabled && (
        <div className="form-control">
          <label className="label flex justify-between">
            <span className="label-text">Zoom Level</span>
            <span className="label-text font-bold">
              {options[MODES.ENHANCE].zoomLevel}%
            </span>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={options[MODES.ENHANCE].zoomLevel}
            onChange={(e) => handleSliderChange("zoomLevel", parseInt(e.target.value))}
            className="range range-primary range-xs w-full"
          />
        </div>
      )}
    </div>
  );
};

export default EnhanceOptions;
