import {
  FaChrome,
  FaCreditCard,
  FaFileUpload,
  FaQuestionCircle,
  FaShieldAlt,
  FaWifi,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { useState } from "react";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  const faqItems = [
    {
      id: 1,
      icon: <FaShieldAlt className="text-primary" />,
      question: "How does the background removal work?",
      answer: (
        <div className="space-y-3">
          <p>
            Image Monster uses state-of-the-art AI segmentation models to
            identify and separate foreground subjects from backgrounds. The
            process works in three steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              The AI model analyzes your image to identify foreground objects
              and people
            </li>
            <li>
              It creates a pixel-perfect mask that separates subject from
              background
            </li>
            <li>
              The background is removed, leaving you with a transparent PNG
            </li>
          </ol>
          <p>
            You can fine-tune the results with settings like threshold
            adjustment, smoothing, feathering, and edge preservation.
          </p>
        </div>
      ),
    },
    {
      id: 2,
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
          <p className="text-sm bg-base-200 p-3 rounded-lg">
            <strong>Technical note:</strong> The only data that leaves your
            device is the initial request to download the AI model. No image
            data is ever transmitted.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      icon: <FaFileUpload className="text-primary" />,
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
      id: 4,
      icon: <FaWifi className="text-primary" />,
      question: "Is an internet connection required?",
      answer: (
        <div className="space-y-3">
          <p>An internet connection is required for:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Initial loading of the app interface</li>
            <li>Downloading the AI model on your first visit</li>
          </ul>
          <p>
            Once the model is downloaded and cached, you can use Image Monster
            offline for processing images. If you return to the site without an
            internet connection, it will still work as long as the model has
            been previously cached.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      icon: <FaChrome className="text-primary" />,
      question: "Which browsers are supported?",
      answer: (
        <div className="space-y-3">
          <p>
            Image Monster works best in modern browsers that support WebGPU for
            hardware-accelerated processing:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2 mt-2">
            <li className="flex items-center gap-2 bg-base-200 rounded p-2">
              <span className="badge badge-success">Fast</span> Chrome/Edge 113+
              (best performance)
            </li>
            <li className="flex items-center gap-2 bg-base-200 rounded p-2">
              <span className="badge badge-success">Fast</span> Safari 17+
              (macOS/iOS)
            </li>
            <li className="flex items-center gap-2 bg-base-200 rounded p-2">
              <span className="badge badge-warning">Slower</span> Firefox
              (WebAssembly fallback)
            </li>
            <li className="flex items-center gap-2 bg-base-200 rounded p-2">
              <span className="badge badge-warning">Slower</span> Older browser
              versions (WebAssembly fallback)
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
      id: 6,
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
            If you enjoy using Image Monster and want to support its
            development, you can make a contribution through Ko-Fi.
          </p>
          <div className="flex gap-2 mt-2">
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
      id: 7,
      icon: <FaQuestionCircle className="text-primary" />,
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
      id: 8,
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
          <div className="flex gap-3 mt-4">
            <a
              href="https://github.com/oscarrc/image-monster/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-[#333] hover:bg-[#555] text-white"
            >
              GitHub Issues
            </a>
            <a
              href="https://ko-fi.com/oscarrc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-[#FF5E5B] hover:bg-[#FF7A77] text-white"
            >
              Contact via Ko-Fi
            </a>
          </div>
        </div>
      ),
    },
  ];

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

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className={`mb-4 overflow-hidden transition-all duration-300 bg-base-200 rounded-box ${
                openItem === item.id ? "shadow-lg" : ""
              }`}
            >
              <div
                className={`p-4 flex justify-between items-center cursor-pointer ${
                  openItem === item.id ? "bg-primary/10" : ""
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium">{item.question}</h3>
                </div>
                <div className="flex-shrink-0">
                  {openItem === item.id ? (
                    <IoIosArrowUp className="h-5 w-5 text-primary" />
                  ) : (
                    <IoIosArrowDown className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openItem === item.id
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 pt-0 border-t border-base-300">
                  <div className="pt-4">{item.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
