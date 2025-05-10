import Input from "./components/Input";
import Layout from "@/components/Layout";
import { MODELS } from "@/types/imageGeneration";
import { ModelInfo } from "@/components/ModelInfo";

const Generation = () => {
  const hasPrompt = false;

  return (
    <Layout>
      <section
        className={`w-full flex flex-col transition-all duration-500 items-center gap-8 py-8 ${
          !hasPrompt ? "justify-center h-full" : "justify-start"
        }`}
        aria-label="Image generation application"
      >
        {!hasPrompt && (
          <div className="max-w-3xl text-center space-y-2 mb-1.5">
            <h1 className="text-4xl md:text-5xl font-bold">
              Ask the <span className="text-primary font-bold">Monster</span>{" "}
              for an <span className="text-primary">Image</span>
            </h1>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Send a message to the our monster and it will generate an image
              for you. It runs entirely in the browser, so no data is sent to a
              server.
            </p>
          </div>
        )}

        <div
          className="w-full max-w-3xl mx-auto flex-shrink-0"
          style={{
            height: hasPrompt ? "10rem" : "15rem",
            marginBottom: hasPrompt ? "0.5rem" : "0",
          }}
          aria-label="Write your prompt here"
        >
          <Input />
        </div>
        {!hasPrompt && (
          <div>
            <ModelInfo models={MODELS} />
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Generation;
