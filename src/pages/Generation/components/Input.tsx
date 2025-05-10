import { KeyboardEvent, useRef } from "react";

// src/pages/Generation/components/Input.tsx
import { VscSend } from "react-icons/vsc";
import { useImageGeneration } from "@/contexts/ImageGenerationContext/useImageGeneration";

const Input = () => {
  const { prompt, setPrompt, generateImage, isGenerating } =
    useImageGeneration();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (isGenerating || !prompt.trim()) return;

    await generateImage();

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full h-full">
      <textarea
        ref={textareaRef}
        className="textarea textarea-bordered border-base-content/70 disabled:border-base-content/70 focus:border-primary focus:outline-none w-full h-full border-4 rounded-xl p-6 transition-all duration-300 ease-in-out resize-none"
        placeholder="Type your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isGenerating}
      />
      <button
        className={`absolute bottom-4 right-2 btn btn-link text-primary disabled:text-base-content/70 ${
          isGenerating ? "cursor-not-allowed" : ""
        }`}
        type="button"
        onClick={handleSubmit}
        disabled={isGenerating || !prompt.trim()}
        aria-label="Generate image"
      >
        {isGenerating ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <VscSend className="h-8 w-8" />
        )}
      </button>
    </div>
  );
};

export default Input;
