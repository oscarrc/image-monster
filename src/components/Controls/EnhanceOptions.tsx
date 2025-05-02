import { MODES, type EnhanceOptions } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const EnhanceOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions(MODES.ENHANCE, {
      scale: parseFloat(e.target.value),
    });
  };

  const handleZoomEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions(MODES.ENHANCE, {
      zoomEnabled: e.target.checked,
    });
  };

  const handleZoomLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions(MODES.ENHANCE, {
      zoomLevel: parseInt(e.target.value),
    });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Scale</span>
          <span className="label-text-alt font-bold">
            {options.enhance.scale}x
          </span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={options.enhance.scale}
          onChange={handleScaleChange}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Enable Zoom</span>
          <input
            type="checkbox"
            checked={options.enhance.zoomEnabled}
            onChange={handleZoomEnabledChange}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
      {options.enhance.zoomEnabled && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Zoom Level</span>
            <span className="label-text-alt font-bold">
              {options.enhance.zoomLevel}%
            </span>
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="5"
            value={options.enhance.zoomLevel}
            onChange={handleZoomLevelChange}
            className="range range-primary range-xs w-full"
          />
        </div>
      )}
    </div>
  );
};

export default EnhanceOptions;
