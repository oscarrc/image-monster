import { MODES } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const AVAILABLE_STYLES = [
  {
    name: "Ghibli",
    value: "ghibli.png",
  },
  {
    name: "Dragon Ball",
    value: "dragon-ball.png",
  },
] as const;

const StyleOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleSliderChange = (
    key: keyof typeof options[MODES.STYLE],
    value: number
  ) => {
    updateOptions(MODES.STYLE, {
      ...options[MODES.STYLE],
      [key]: value,
    });
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOptions(MODES.STYLE, {
      ...options[MODES.STYLE],
      style: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Style</span>
        </label>
        <select
          onChange={handleStyleChange}
          value={options[MODES.STYLE].style}
          className="select select-primary select-sm w-full"
        >
          {AVAILABLE_STYLES.map((style) => (
            <option key={style.value} value={style.value}>
              {style.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label flex justify-between">
          <span className="label-text">Style Strength</span>
          <span className="label-text font-bold">
            {options[MODES.STYLE].styleStrength}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={options[MODES.STYLE].styleStrength}
          onChange={(e) => handleSliderChange("styleStrength", parseFloat(e.target.value))}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="form-control">
        <label className="label flex justify-between">
          <span className="label-text">Inference steps</span>
          <span className="label-text font-bold">
            {options[MODES.STYLE].numInferenceSteps}
          </span>
        </label>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={options[MODES.STYLE].numInferenceSteps}
          onChange={(e) => handleSliderChange("numInferenceSteps", parseInt(e.target.value))}
          className="range range-primary range-xs w-full mt-1"
        />
      </div>
      <div className="form-control">
        <label className="label flex justify-between">
          <span className="label-text">Guidance Scale</span>
          <span className="label-text font-bold">
            {options[MODES.STYLE].guidanceScale}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.5"
          value={options[MODES.STYLE].guidanceScale}
          onChange={(e) => handleSliderChange("guidanceScale", parseFloat(e.target.value))}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Style Preview</span>
        </label>
        <div className="relative w-full rounded-lg overflow-hidden bg-base-300">
          <img
            src={`/styles/${options[MODES.STYLE].style}`}
            alt="Style preview"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleOptions;
