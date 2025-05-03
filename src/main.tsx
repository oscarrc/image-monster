import "./index.css";

import App from "./App";
import { ImageProcessingProvider } from "@/contexts/ImageProcessingContext/ImageProcessingProvider";
import { StrictMode } from "react";
import { ToastProvider } from "./contexts/ToastContext/ToastProvider";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <ImageProcessingProvider>
        <App />
      </ImageProcessingProvider>
    </ToastProvider>
  </StrictMode>
);
