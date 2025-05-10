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
  href: string;
  width?: number;
}

const TechStack = () => {
  // Define the logos to display in the slider
  const logos: Logo[] = [
    { src: reactLogo, alt: "React", width: 180, href: "https://react.dev" },
    {
      src: tailwindcssLogo,
      alt: "TailwindCSS",
      width: 200,
      href: "https://tailwindcss.com",
    },
    {
      src: daisyuiLogo,
      alt: "DaisyUI",
      width: 180,
      href: "https://daisyui.com",
    },
    {
      src: huggingfaceLogo,
      alt: "Hugging Face",
      width: 200,
      href: "https://hugginface.co",
    },
    {
      src: transformersjsLogo,
      alt: "Transformers.js",
      width: 200,
      href: "https://huggingface.co/docs/transformers.js/index",
    },
    {
      src: webgpuLogo,
      alt: "WebGPU",
      width: 180,
      href: "https://www.w3.org/TR/webgpu/",
    },
  ];

  // Double the logos to create a seamless loop
  const allLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-4 bg-transparent">
      <div className="flex animate-slide hover:pause">
        {allLogos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8 min-w-max"
          >
            <a
              href={logo.href}
              className="w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full max-h-12 transition-all duration-300 filter grayscale opacity-80 hover:filter-none hover:scale-110 hover:opacity-100"
                style={{ maxWidth: logo.width ? `${logo.width}px` : "160px" }}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
