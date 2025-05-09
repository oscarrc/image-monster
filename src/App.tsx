import { BrowserRouter, Route, Routes } from "react-router-dom";

import Background from "@/pages/Background";
import Generation from "@/pages/Generation";
import { ImageGenerationProvider } from "./contexts/ImageGenerationContext/ImageGenerationProvider";
import { ImageProcessingProvider } from "@/contexts/ImageProcessingContext/ImageProcessingProvider";
import { ToastProvider } from "@/contexts/ToastContext/ToastProvider";

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ImageProcessingProvider>
                <Background />
              </ImageProcessingProvider>
            }
          />
          <Route
            path="/generation"
            element={
              <ImageGenerationProvider>
                <Generation />
              </ImageGenerationProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
