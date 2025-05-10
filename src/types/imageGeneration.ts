import { Model } from "./model";

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

export interface GenerationOptions {
  maxNewTokens?: number;
  doSample?: boolean;
  temperature?: number;
  topK?: number;
  topP?: number;
  repetitionPenalty?: number;
}

export const DEFAULT_GENERATION_OPTIONS: GenerationOptions = {
  maxNewTokens: 1024, // Will be overridden with processor.num_image_tokens
  doSample: true,
  temperature: 0.8,
  topK: 50,
  topP: 0.95,
  repetitionPenalty: 1.1,
};

export const MODELS: Model[] = [
  {
    id: "onnx-community/Janus-Pro-1B-ONNX",
    name: "Janus Pro 1B",
    creator: "DeepSeek AI",
    size: "~7GB",
    recommended: true,
    description: "A powerful multimodal model capable of both image-to-text and text-to-image generation with professional-grade output quality.",
    features: ["Image+text to text", "Text to image generation", "Formula recognition", "High-quality image output", "WebGPU compatible"]
  },
  {
    id: "onnx-community/Janus-1.3B-ONNX",
    name: "Janus 1.3B",
    creator: "DeepSeek AI",
    size: "~9GB",
    recommended: false,
    description: "A larger multimodal model with 1.3B parameters that handles both vision and language tasks.",
    features: ["Image understanding", "Text to image generation", "Formula conversion", "Enhanced contextual reasoning", "WebGPU compatible"]
  }
];