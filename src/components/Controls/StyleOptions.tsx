import { MODES, type StyleOptions } from "@/types/imageProcessing";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const StyleOptions = () => {
  const { options, updateOptions } = useImageProcessing();

  const handleStyleStrengthChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateOptions(MODES.STYLE, {
      styleStrength: parseFloat(e.target.value),
    });
  };

  const handleInferenceStepsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateOptions(MODES.STYLE, {
      numInferenceSteps: parseInt(e.target.value),
    });
  };

  const handleGuidanceScaleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateOptions(MODES.STYLE, {
      guidanceScale: parseFloat(e.target.value),
    });
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOptions(MODES.STYLE, {
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
          value={options.style.style}
          className="select select-primary select-sm w-full"
        >
          <option value="ghibli">Ghibli</option>
          <option value="anime">Anime</option>
          <option value="realistic">Realistic</option>
          <option value="cartoon">Cartoon</option>
          <option value="oil_painting">Oil Painting</option>
          <option value="watercolor">Watercolor</option>
          <option value="sketch">Sketch</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Style Strength</span>
          <span className="label-text-alt font-bold">
            {options.style.styleStrength}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={options.style.styleStrength}
          onChange={handleStyleStrengthChange}
          className="range range-primary range-xs w-full"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Inference Steps</span>
          <span className="label-text-alt font-bold">
            {options.style.numInferenceSteps}
          </span>
        </label>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={options.style.numInferenceSteps}
          onChange={handleInferenceStepsChange}
          className="range range-primary range-xs w-full mt-1"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Guidance Scale</span>
          <span className="label-text-alt font-bold">
            {options.style.guidanceScale}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.5"
          value={options.style.guidanceScale}
          onChange={handleGuidanceScaleChange}
          className="range range-primary range-xs w-full"
        />
      </div>
    </div>
  );
};

export default StyleOptions;
