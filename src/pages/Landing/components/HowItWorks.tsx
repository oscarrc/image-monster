import {
  FaCloudDownloadAlt,
  FaDownload,
  FaLaptopCode,
  FaUpload,
} from "react-icons/fa";

import { BiSolidRocket } from "react-icons/bi";
import { CiCircleCheck } from "react-icons/ci";
import { useState } from "react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Model Download",
      icon: <FaDownload className="h-8 w-8 text-primary" />,
      description:
        "On your first visit, the AI model is downloaded once and cached in your browser. This only happens once!",
      details:
        "The model is securely stored in your browser cache, making future visits faster. Depending on your connection, the initial download may take 30-60 seconds but it's worth the wait for complete privacy.",
    },
    {
      id: 2,
      title: "Upload or Prompt",
      icon: <FaUpload className="h-8 w-8 text-primary" />,
      description:
        "Upload an image for background removal or enter a text prompt to generate new images.",
      details:
        "You can upload JPG, PNG, or WebP images up to 10MB. For best results, ensure your subject is clearly visible against the background.",
    },
    {
      id: 3,
      title: "Local Processing",
      icon: <FaLaptopCode className="h-8 w-8 text-primary" />,
      description:
        "The AI model runs on your device using resources from your computer - your data never leaves!",
      details:
        "Using WebGPU technology, Image Monster processes your images directly in your browser, leveraging your device's GPU for faster performance. This ensures 100% privacy as nothing is sent to any server.",
    },
    {
      id: 4,
      title: "Download Results",
      icon: <FaCloudDownloadAlt className="h-8 w-8 text-primary" />,
      description:
        "Get your processed images with transparent backgrounds or brand new AI-generated creations.",
      details:
        "Download your images as PNG files with transparent backgrounds, ready to use in your projects. You can also batch process multiple images and download them all as a ZIP file.",
    },
  ];

  return (
    <div className="py-16 w-full rounded-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            How The <span className="text-primary">Monster</span> Works
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            All processing happens directly in your browser using WebGPU
            hardware acceleration. Your images never leave your device, ensuring
            100% privacy.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mx-auto max-w-6xl">
          {/* Steps sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-base-300 rounded-xl p-4 h-full">
              <ul className="steps steps-vertical">
                {steps.map((step) => (
                  <li
                    key={step.id}
                    className={`step cursor-pointer transition-all duration-300 ${
                      activeStep >= step.id ? "step-primary" : ""
                    }`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div
                      className={`mt-2 p-2 rounded-lg ${
                        activeStep === step.id ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="font-bold flex items-center gap-2">
                        {step.title}
                      </div>
                      <p className="text-sm text-left mt-1 hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step details */}
          <div className="lg:w-2/3">
            <div className="bg-base-300 rounded-xl p-6 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  {steps[activeStep - 1].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Step {activeStep}: {steps[activeStep - 1].title}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-lg">{steps[activeStep - 1].description}</p>
                <p className="text-base-content/80">
                  {steps[activeStep - 1].details}
                </p>

                {activeStep === 1 && (
                  <div className="alert alert-info mt-4">
                    <BiSolidRocket className="h-5 w-5" />
                    <span>
                      Models range from 25MB to 900MB depending on quality
                      needs. Only downloaded once!
                    </span>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="bg-base-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold mb-2">Why This Matters:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CiCircleCheck className="text-success h-5 w-5 flex-shrink-0" />
                        <span>Your private photos stay private</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CiCircleCheck className="text-success h-5 w-5 flex-shrink-0" />
                        <span>Works offline once loaded</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CiCircleCheck className="text-success h-5 w-5 flex-shrink-0" />
                        <span>Faster processing with WebGPU</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
