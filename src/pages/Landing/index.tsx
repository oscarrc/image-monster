import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Layout>
      <div className="mx-auto flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Image Monster</h1>
        <p className="text-lg mb-8">
          Your one-stop solution for image generation and background removal.
        </p>
        <Link to="/generation" className="btn btn-primary mb-4">
          Generate Images
        </Link>
        <Link to="/background" className="btn btn-secondary">
          Remove Backgrounds
        </Link>
      </div>
    </Layout>
  );
};

export default Landing;
