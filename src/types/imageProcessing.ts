export enum MODES {
  BACKGROUND = 'background',
  ENHANCE = 'enhance',
  STYLE = 'style',
}

export interface BackgroundOptions {
  threshold: number;  
  thresholdEnabled: boolean;
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