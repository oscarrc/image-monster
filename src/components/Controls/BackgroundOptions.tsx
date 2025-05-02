import { MODES, type BackgroundOptions } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const BackgroundOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOptions(MODES.BACKGROUND, {
      threshold: parseFloat(e.target.value),
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
    </div>
  );
};

export default BackgroundOptions;
