import { MODES, type BackgroundOptions } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const BackgroundOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions(MODES.BACKGROUND, {
      threshold: parseFloat(e.target.value),
    });
  };

  const handleMaskBackgroundChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateOptions(MODES.BACKGROUND, {
      maskBackground: e.target.checked,
    });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Threshold</span>
          <span className="label-text-alt font-bold">
            {options.background.threshold}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={options.background.threshold}
          onChange={handleThresholdChange}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Mask Background</span>
          <input
            type="checkbox"
            checked={options.background.maskBackground}
            onChange={handleMaskBackgroundChange}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>
    </div>
  );
};

export default BackgroundOptions;
