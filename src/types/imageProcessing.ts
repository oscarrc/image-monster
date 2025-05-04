export interface Options {
  threshold: number;
  thresholdEnabled: boolean;
  smoothingEnabled: boolean;
  smoothingRadius: number;
  featherEnabled: boolean;
  featherRadius: number;
  preserveEdges: boolean;
  selectedModel: string;
}

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: "pending" | "processing" | "completed" | "error";
  name: string;
}

export const DEFAULT_OPTIONS: Options = {
  threshold: 0.5,
  thresholdEnabled: false,
  smoothingEnabled: false,
  smoothingRadius: 3,
  featherEnabled: false,
  featherRadius: 5,
  preserveEdges: false,
  selectedModel: "RMGB-1.4",
}; 


export const MODELS: Record<string, string> = {
  modnet: "Xenova/modnet",
  "RMGB-1.4": "briaai/RMBG-1.4",
};