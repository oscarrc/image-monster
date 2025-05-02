import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ImageProcessingProvider } from "@/contexts/ImageProcessingContext/ImageProcessingProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ImageProcessingProvider>
        <App />
      </ImageProcessingProvider>
    </BrowserRouter>
  </StrictMode>
);
