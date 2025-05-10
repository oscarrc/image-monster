import daisyuiLogo from "@/assets/logos/daisyui.svg";
import huggingfaceLogo from "@/assets/logos/huggingface.svg";
import reactLogo from "@/assets/logos/react.svg";
import tailwindcssLogo from "@/assets/logos/tailwindcss.svg";
import transformersjsLogo from "@/assets/logos/transformersjs.svg";
import webgpuLogo from "@/assets/logos/webgpu.svg";

// Define the logo data structure
interface Logo {
  src: string;
  alt: string;
  width?: number;
}

const TechStack = () => {
  // Define the logos to display in the slider
  const logos: Logo[] = [
    { src: reactLogo, alt: "React", width: 180 },
    { src: tailwindcssLogo, alt: "TailwindCSS", width: 200 },
    { src: daisyuiLogo, alt: "DaisyUI", width: 180 },
    { src: huggingfaceLogo, alt: "Hugging Face", width: 200 },
    { src: transformersjsLogo, alt: "Transformers.js", width: 200 },
    { src: webgpuLogo, alt: "WebGPU", width: 180 },
  ];

  // Double the logos to create a seamless loop
  const allLogos = [...logos, ...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden py-4 bg-transparent group">
      <div className="flex w-[calc(200px*12)] animate-slide group-hover:pause">
        {allLogos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 min-w-[200px]"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-12 transition-all duration-300 filter grayscale opacity-80 hover:filter-none hover:opacity-100"
              style={{ maxWidth: logo.width ? `${logo.width}px` : "160px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
