import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "@/components/layout";
import ProcessView from "@/views/ProcessView";
import UploadView from "@/views/UploadView";
import { useEffect } from "react";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";
import { useToast } from "./contexts/ToastContext/useToast";

const App = () => {
  const { image } = useImageProcessing();
  const { addToast } = useToast();

  useEffect(() => {
    [1, 2, 3, 4, 5].forEach((i) => {
      setTimeout(() => {
        addToast(`This is a toast message ${i}`, "info");
      }, i * 1000);
    });
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<UploadView />} />
        <Route
          path="/process"
          element={image ? <ProcessView /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
