declare module "svg-path-properties" {
  interface Point {
    x: number;
    y: number;
  }

  interface PathProperties {
    getTotalLength(): number;
    getPointAtLength(length: number): Point;
    getTangentAtLength(length: number): Point;
    getPropertiesAtLength(length: number): Point & { tangentX: number; tangentY: number };
    getParts(): Array<{ start: Point; end: Point; length: number }>;
  }

  export class svgPathProperties implements PathProperties {
    constructor(d: string);
    getTotalLength(): number;
    getPointAtLength(length: number): Point;
    getTangentAtLength(length: number): Point;
    getPropertiesAtLength(length: number): Point & { tangentX: number; tangentY: number };
    getParts(): Array<{ start: Point; end: Point; length: number }>;
  }
}
