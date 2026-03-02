export interface Dot {
  x: number;
  y: number;
  n: number;
}

export interface GuideLine {
  path: string;
}

export interface DotToDoResult {
  dots: Dot[];
  guideLines: GuideLine[];
}

export interface TracedPaths {
  paths: string[];
  viewBox: string;
  width: number;
  height: number;
}

export interface GeneratedImage {
  id: string;
  base64: string;
  traced?: TracedPaths;
  tracing?: boolean;
}
