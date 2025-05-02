import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "@/components/layout";
import ProcessView from "@/views/ProcessView";
import UploadView from "@/views/UploadView";
import { useImageProcessing } from "@/contexts/ImageProcessingContext/useImageProcessing";

const App = () => {
  const { image } = useImageProcessing();

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
