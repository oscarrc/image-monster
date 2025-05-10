import FAQ from "./components/Faq";
import HowItWorks from "./components/HowItWorks";
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
          <a href="/generation" className="btn btn-primary btn-outline btn-lg">
            Generate Images
          </a>
        </div>
      </section>

      {/* Feature Stats */}
      <div className="stats stats-vertical xl:stats-horizontal shadow mx-auto my-16 bg-neutral">
        {featuresConfig.map((feature, index) => (
          <div className="stat" key={index}>
            <div className="stat-figure text-primary">{feature.icon}</div>
            <div className="stat-title">{feature.title}</div>
            <div className="stat-value text-primary">{feature.value}</div>
            <div className="stat-desc">{feature.description}</div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <HowItWorks />

      {/* Tech Stack */}
      <div className="container mx-auto px-4 py-16">
        <TechStack />
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="container mx-auto flex flex-col gap-16 items-center mb-32 mt-16">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold">
            <span className="text-primary">Scared</span> to Try It?
          </h2>
          <p className="text-xl">
            Start using Image Monster today - it's free and private!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/background" className="btn btn-primary btn-lg">
            Remove Backgrounds
          </a>
          <a href="/generation" className="btn btn-primary btn-outline btn-lg">
            Generate Images
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
