import { FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-2">
      <aside className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 text-sm">
        <p>
          Made with <FaHeart className="h-3 w-3 text-primary inline mx-1" /> by{" "}
          <a
            href="https://oscarrc.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Oscar R.C.
          </a>
        </p>
        <p>
          All processing is done in the browser thanks to{" "}
          <a
            href="https://huggingface.co/docs/transformers.js/en/index"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Hugging Face Transformers.js
          </a>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
