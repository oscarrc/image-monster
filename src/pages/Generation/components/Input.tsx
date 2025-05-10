import { VscSend } from "react-icons/vsc";

const Input = () => {
  return (
    <div className="relative w-full h-full">
      <textarea
        className="textarea textarea-bordered border-base-content/70 focus:border-primary focus:outline-none w-full h-full border-4 rounded-xl p-6 transition-all duration-300 ease-in-out resize-none"
        placeholder="Type your prompt here..."
      />
      <button
        className="absolute bottom-4 right-2 btn btn-link text-primary"
        type="button"
      >
        <VscSend className="h-8 w-8" />
      </button>
    </div>
  );
};

export default Input;
