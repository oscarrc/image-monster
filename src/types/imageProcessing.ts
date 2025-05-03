export enum MODES {
  BACKGROUND = 'background',
  ENHANCE = 'enhance',
  STYLE = 'style',
}

export interface BackgroundOptions {
  threshold: number;
  thresholdEnabled: boolean;
  smoothingEnabled: boolean;
  smoothingRadius: number;
  featherEnabled: boolean;
  featherRadius: number;
  preserveEdges: boolean;
}

export interface EnhanceOptions {
  scale: number;
  zoomEnabled: boolean;
  zoomLevel: number;
}

export interface StyleOptions {
  style: string;
  styleStrength: number;
  numInferenceSteps: number;
  guidanceScale: number;
}

export type ProcessingOptions = {
  [MODES.BACKGROUND]: BackgroundOptions;
  [MODES.ENHANCE]: EnhanceOptions;
  [MODES.STYLE]: StyleOptions;
};

export const DEFAULT_OPTIONS: ProcessingOptions = {
  [MODES.BACKGROUND]: {
    threshold: 0.5,
    thresholdEnabled: false,
    smoothingEnabled: false,
    smoothingRadius: 3,
    featherEnabled: false,
    featherRadius: 5,
    preserveEdges: false,
  },
  [MODES.ENHANCE]: {
    scale: 1.0,
    zoomEnabled: false,
    zoomLevel: 50,
  },
  [MODES.STYLE]: {
    styleStrength: 0.5,
    numInferenceSteps: 20,
    guidanceScale: 7.5,
    style: "ghibli.png",
  },
}; 