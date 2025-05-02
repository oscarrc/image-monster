import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ImageProvider } from "@/contexts/ImageContext/ImageProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ImageProvider>
        <App />
      </ImageProvider>
    </BrowserRouter>
  </StrictMode>
);
