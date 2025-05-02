import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ImageProcessingProvider } from "@/contexts/ImageProcessingContext/ImageProcessingProvider";
import { StrictMode } from "react";
import { ToastProvider } from "./contexts/ToastContext/ToastProvider";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ImageProcessingProvider>
          <App />
        </ImageProcessingProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
