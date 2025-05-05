export interface Options {
  threshold: number;
  thresholdEnabled: boolean;
  smoothingEnabled: boolean;
  smoothingRadius: number;
  featherEnabled: boolean;
  featherRadius: number;
  preserveEdges: boolean;
}

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: "pending" | "processing" | "completed" | "error";
  name: string;
  options: Options;
}

export const DEFAULT_OPTIONS: Options = {
  threshold: 0.5,
  thresholdEnabled: false,
  smoothingEnabled: false,
  smoothingRadius: 3,
  featherEnabled: false,
  featherRadius: 5,
  preserveEdges: false,
}; 

export interface Model {
  id: string;
  name: string;
  creator: string;
  size: string;
  recommended: boolean;
  description: string;
  features: string[];
}

export const MODELS: Model[] = [
  // {
  //   id: "briaai/RMBG-2.0",
  //   name: "RMBG-2.0",
  //   creator: "BRIA AI",
  //   size: "~1GB",
  //   recommended: false,
  //   description: "BRIA's RMBG-2.0 is a state-of-the-art background removal model that significantly improves upon RMBG-1.4. Trained on carefully selected diverse datasets including general stock images, e-commerce, gaming, and advertising content.",
  //   features: ["Highest accuracy", "Advanced architecture", "Excellent for professional use"]
  // },
  {
    id: "onnx-community/BiRefNet-ONNX",
    name: "BiRefNet",
    creator: "ONNX Community",
    size: "~900MB",
    recommended: false,
    description: "BiRefNet is a high-resolution dichotomous image segmentation model that uses bilateral reference for advanced background removal.",
    features: ["Web-optimized", "High-resolution output", "Advanced segmentation"]
  },
  {
    id: "briaai/RMBG-1.4",
    name: "RMBG-1.4",
    creator: "BRIA AI",
    size: "~175MB",
    recommended: true,
    description: "BRIA's Background Removal model is a professional-grade, state-of-the-art segmentation model trained on a diverse, high-quality dataset.",
    features: ["Higher accuracy", "Larger model", "Better for complex images"]
  },
  {
    id: "Xenova/modnet",
    name: "MODNet",
    creator: "Xenova",
    size: "~25MB",
    recommended: false,
    description: "MODNet is a fast, lightweight model for portrait matting that works in real-time. It uses a trimap-free approach for background removal.",
    features: ["Fast processing", "Smaller size", "Optimized for portraits"]
  }
];