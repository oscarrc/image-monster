import Layout from "@/components/Layout";
import TechStack from "./components/TechStack";

// Config files for generating content
const featuresConfig = [
  {
    title: "Privacy First",
    value: "100%",
    description: "All processing stays in your browser",
    icon: "🔒",
  },
  {
    title: "Processing",
    value: "Fast",
    description: "Hardware-accelerated with WebGPU",
    icon: "⚡",
  },
  {
    title: "Quality",
    value: "High",
    description: "Professional-grade AI models",
    icon: "✨",
  },
  {
    title: "Cost",
    value: "Free",
    description: "No subscriptions or hidden fees",
    icon: "💸",
  },
];

const faqConfig = [
  {
    question: "How does the background removal work?",
    answer:
      "Image Monster uses advanced AI models from Hugging Face to detect and remove backgrounds directly in your browser. The segmentation model identifies foreground subjects and creates a transparent background.",
  },
  {
    question: "Do my images get uploaded to a server?",
    answer:
      "No! All processing happens directly in your browser using WebGPU or WebAssembly. Your images never leave your device, ensuring complete privacy.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "For input, Image Monster supports JPG, PNG, and WebP formats up to 10MB. Processed images are downloaded as transparent PNGs.",
  },
  {
    question: "Is an internet connection required?",
    answer:
      "An internet connection is required for the initial loading of the app and AI models. Once loaded, the app can function offline for processing images.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "Image Monster works best in modern browsers that support WebGPU for accelerated processing (Chrome, Edge, Safari). It will fall back to WebAssembly on other browsers, but processing may be slower.",
  },
  {
    question: "Is this service free?",
    answer:
      "Yes, Image Monster is completely free to use! If you enjoy the service, you can support the developer through Ko-fi.",
  },
];

const LandingPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="flex flex-col gap-8 items-center justify-center container mx-auto px-4 text-center py-16 min-h-[70vh]">
        <h1 className="text-5xl md:text-6xl font-bold">
          Feed the <span className="text-primary">Monster</span> an{" "}
          <span className="text-primary">Image</span>
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Upload images and our AI monster will remove their backgrounds. All
          processing happens directly in your browser - your images never leave
          your device!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/background" className="btn btn-primary btn-lg">
            Remove Backgrounds
          </a>
          <a href="/generation" className="btn btn-secondary btn-lg">
            Generate Images
          </a>
        </div>
      </section>

      {/* Feature Stats */}
      <div className="stats stats-vertical xl:stats-horizontal shadow w-full mx-auto my-16 bg-neutral">
        {featuresConfig.map((feature, index) => (
          <div className="stat" key={index}>
            <div className="stat-figure text-primary text-3xl">
              {feature.icon}
            </div>
            <div className="stat-title">{feature.title}</div>
            <div className="stat-value text-primary">{feature.value}</div>
            <div className="stat-desc">{feature.description}</div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <section className="container flex flex-col items-center mx-auto py-16 gap-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <p className="text-base-content/70">
          All processing happens directly in your browser using WebGPU hardware
          acceleration. Your images never leave your device, ensuring 100%
          privacy.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
          <div className="lg:w-1/3 card bg-base-200 shadow-xl">
            <div className="card-body p-0">
              <ul className="menu bg-base-200 w-full rounded-box">
                <li className="menu-title px-4 pt-4">
                  <span>Steps</span>
                </li>
                <li>
                  <a className="active">
                    <span className="badge badge-primary mr-2">1</span>
                    Model Download
                    <span className="badge badge-sm">First visit only</span>
                  </a>
                </li>
                <li>
                  <a>
                    <span className="badge badge-primary mr-2">2</span>
                    Upload Images
                  </a>
                </li>
                <li>
                  <a>
                    <span className="badge badge-primary mr-2">3</span>
                    Local Processing
                    <span className="badge badge-sm">Using WebGPU</span>
                  </a>
                </li>
                <li>
                  <a>
                    <span className="badge badge-primary mr-2">4</span>
                    Download Results
                  </a>
                </li>
                <li className="menu-title px-4 pt-4">
                  <span>Features</span>
                </li>
                <li>
                  <a>
                    <span className="badge badge-secondary mr-2">A</span>
                    Background Removal
                  </a>
                </li>
                <li>
                  <a>
                    <span className="badge badge-secondary mr-2">B</span>
                    Image Generation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:w-2/3 card bg-base-200 shadow-xl overflow-hidden">
            <div className="card-body p-6">
              <div className="lottie-container bg-base-300 rounded-box min-h-[300px] flex items-center justify-center">
                {/* This is where the Lottie animation would be displayed */}
                <div className="text-6xl">🎬</div>
                <p className="mt-4 text-center text-lg">
                  Animation for selected step will appear here
                </p>
                {/* In actual implementation, you would use: */}
                {/* <Lottie animationData={selectedAnimation} /> */}
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-3">
                  One-Time Model Download
                </h3>
                <p className="mb-4">
                  On your first visit, Image Monster downloads the AI model once
                  and caches it in your browser. After that, you can use the app
                  even offline!
                </p>
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    Models range from 25MB to 900MB depending on quality needs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <div className="container mx-auto px-4 py-16">
        <TechStack />
      </div>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          {faqConfig.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-200 mb-2"
            >
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                {faq.question}
              </div>
              <div className="collapse-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Try It?</h2>
        <p className="text-xl mb-8">
          Start using Image Monster today - it's free and private!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/background" className="btn btn-primary btn-lg">
            Remove Backgrounds
          </a>
          <a href="/generation" className="btn btn-secondary btn-lg">
            Generate Images
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
