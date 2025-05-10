import { KeyboardEvent, useRef } from "react";

interface ResultPreviewProps {
  originalUrl: string;
  processedUrl: string;
}

export const ResultPreview = ({
  originalUrl,
  processedUrl,
}: ResultPreviewProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current.querySelector(
      ".diff-resizer"
    ) as HTMLDivElement;
    if (!slider) return;

    const container = sliderRef.current;
    const containerWidth = container.clientWidth;
    const step = containerWidth * 0.05; // Move 5% at a time

    let current = parseFloat(slider.style.left || "50%");
    // Convert from percentage to pixels if needed
    if (current.toString().includes("%")) {
      current = (parseFloat(current.toString()) / 100) * containerWidth;
    }

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        current = Math.max(0, current - step);
        slider.style.left = `${(current / containerWidth) * 100}%`;
        break;
      case "ArrowRight":
        e.preventDefault();
        current = Math.min(containerWidth, current + step);
        slider.style.left = `${(current / containerWidth) * 100}%`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full p-4">
      <div className="rounded-lg overflow-hidden">
        <figure
          className="diff min-h-[50vh] h-full w-full"
          ref={sliderRef}
          tabIndex={0}
          role="group"
          aria-label="Image comparison slider. Use arrow keys to adjust the slider position."
          onKeyDown={handleKeyDown}
        >
          <div className="diff-item-1" role="img" aria-label="Original image">
            <img
              alt="Original image with background"
              className="object-contain"
              src={originalUrl}
            />
          </div>
          <div
            className="diff-item-2"
            role="img"
            aria-label="Processed image with background removed"
          >
            <img
              alt="Processed image with transparent background"
              className="object-contain"
              src={processedUrl}
            />
          </div>
          <div
            className="diff-resizer"
            role="slider"
            aria-label="Comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-orientation="horizontal"
          ></div>
        </figure>
      </div>
    </div>
  );
};
