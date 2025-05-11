import {
  FaChrome,
  FaCreditCard,
  FaFileUpload,
  FaImage,
  FaQuestionCircle,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";

import { useState } from "react";

const faqItems = [
  {
    icon: <FaShieldAlt className="text-primary" />,
    question: "How does the background removal work?",
    answer: (
      <div className="space-y-3">
        <p>
          Image Monster uses state-of-the-art AI segmentation models to identify
          and separate foreground subjects from backgrounds. The process works
          in three steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            The AI model analyzes your image to identify foreground objects and
            people
          </li>
          <li>
            It creates a pixel-perfect mask that separates subject from
            background
          </li>
          <li>The background is removed, leaving you with a transparent PNG</li>
        </ol>
        <p>
          You can fine-tune the results with settings like threshold adjustment,
          smoothing, feathering, and edge preservation.
        </p>
      </div>
    ),
  },
  {
    icon: <FaFileUpload className="text-primary" />,
    question: "Do my images get uploaded to a server?",
    answer: (
      <div className="space-y-3">
        <p>
          <strong>No!</strong> This is what makes Image Monster special. All
          processing happens directly in your browser using WebGPU or
          WebAssembly. Your images never leave your device, ensuring complete
          privacy.
        </p>
        <p>
          Unlike other services that upload your images to cloud servers for
          processing, Image Monster downloads the AI model to your device once
          and then processes everything locally.
        </p>
        <p className="text-sm bg-base-300 p-3 rounded-lg">
          <strong>Technical note:</strong> The only data that leaves your device
          is the initial request to download the AI model. No image data is ever
          transmitted.
        </p>
      </div>
    ),
  },
  {
    icon: <FaImage className="text-primary" />,
    question: "Which file formats are supported?",
    answer: (
      <div className="space-y-3">
        <p>For input, Image Monster supports:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>JPG/JPEG</li>
          <li>PNG</li>
          <li>WebP</li>
        </ul>
        <p>
          Maximum file size is <strong>10MB</strong> per image. You can upload
          multiple files simultaneously.
        </p>
        <p>
          All processed images are downloaded as transparent{" "}
          <strong>PNG</strong> files to preserve transparency.
        </p>
      </div>
    ),
  },
  {
    icon: <FaChrome className="text-primary" />,
    question: "Which browsers are supported?",
    answer: (
      <div className="space-y-3">
        <p>
          Image Monster works best in modern browsers that support WebGPU for
          hardware-accelerated processing:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2 mt-2">
          <li className="flex items-center justify-between gap-2 bg-base-300 rounded py-2 px-4">
            <span>Chrome/Edge 113+</span>
            <span className="badge badge-success badge-xs">Fastests</span>
          </li>
          <li className="flex items-center justify-between gap-2 bg-base-300 rounded py-2 px-4">
            <span>Safari 17+</span>
            <span className="badge badge-success badge-xs">Fast</span>
          </li>
          <li className="flex items-center justify-between gap-2 bg-base-300 rounded py-2 px-4">
            <span>Firefox</span>
            <span className="badge badge-warning badge-xs">Slow</span>
          </li>
          <li className="flex items-center justify-between gap-2 bg-base-300 rounded py-2 px-4">
            <span>Other browsers</span>
            <span className="badge badge-warning badge-xs">Slower</span>
          </li>
        </ul>
        <p>
          If your browser doesn't support WebGPU, Image Monster will
          automatically use WebAssembly instead, which still works but may be
          slower.
        </p>
      </div>
    ),
  },
  {
    icon: <FaCreditCard className="text-primary" />,
    question: "Is this service free?",
    answer: (
      <div className="space-y-3">
        <p>
          <strong>Yes, Image Monster is completely free to use!</strong> There
          are:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>No subscriptions</li>
          <li>No usage limits</li>
          <li>No watermarks</li>
          <li>No hidden fees</li>
        </ul>
        <p>
          If you enjoy using Image Monster and want to support its development,
          you can make a contribution through Ko-Fi.
        </p>
        <div className="flex gap-2 mt-4 w-full justify-end">
          <a
            href="https://ko-fi.com/oscarrc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
          >
            Support the developer
          </a>
        </div>
      </div>
    ),
  },
  {
    icon: <FaRobot className="text-primary" />,
    question: "What's the difference between the AI models?",
    answer: (
      <div className="space-y-3">
        <p>
          Image Monster offers multiple AI models with different capabilities:
        </p>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Model</th>
                <th>Size</th>
                <th>Best for</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>RMBG-1.4</strong>
                </td>
                <td>~175MB</td>
                <td>General use</td>
                <td>Good balance of quality and size (Recommended)</td>
              </tr>
              <tr>
                <td>
                  <strong>BiRefNet</strong>
                </td>
                <td>~900MB</td>
                <td>Complex images</td>
                <td>Best quality, largest download</td>
              </tr>
              <tr>
                <td>
                  <strong>MODNet</strong>
                </td>
                <td>~25MB</td>
                <td>Portraits</td>
                <td>Fast, smallest download</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You can switch between models at any time. The model you select will
          be downloaded if it hasn't been already.
        </p>
      </div>
    ),
  },
  {
    icon: <FaQuestionCircle className="text-primary" />,
    question: "Still need help?",
    answer: (
      <div className="space-y-3">
        <p>
          If you can't find the answer to your question, don't hesitate to get
          in touch with us in one of these ways:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>
            Check our{" "}
            <a
              href="https://github.com/oscarrc/image-monster/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              GitHub Issues
            </a>{" "}
            to see if others have the same question
          </li>
          <li>Open a new issue for bugs or feature requests</li>
          <li>Reach out through Ko-Fi if you have other questions</li>
        </ul>
        <div className="flex gap-4 w-full mt-4 justify-end">
          <a
            href="https://github.com/oscarrc/image-monster/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
          >
            GitHub Issues
          </a>
          <a
            href="https://ko-fi.com/oscarrc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-secondary btn-outline"
          >
            Contact via Ko-Fi
          </a>
        </div>
      </div>
    ),
  },
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  return (
    <div className="py-16 w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Questions Our <span className="text-primary">Monster</span> Gets
            Asked
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Here are some common questions about Image Monster. If you have
            additional questions, feel free to reach out!
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto bg-base-200 rounded-box p-4 space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className={`collapse collapse-arrow bg-base-100 rounded-lg border ${
                openItem === idx ? "border-primary" : "border-base-300"
              }`}
            >
              <input
                type="radio"
                name="faq-accordion"
                checked={openItem === idx}
                onChange={() => setOpenItem(idx === openItem ? null : idx)}
              />
              <div
                className={`collapse-title font-medium cursor-pointer ${
                  openItem === idx ? "text-primary" : ""
                }`}
                onClick={() => setOpenItem(idx === openItem ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.question}</span>
                  </div>
                </div>
              </div>
              <div className="collapse-content">{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
