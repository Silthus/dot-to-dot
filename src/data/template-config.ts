export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  svgFilename: string;
  difficulty: "easy" | "medium" | "hard";
  recommendedDots: number;
}

export const categories = [
  { id: "animals", name: "Tiere" },
  { id: "vehicles", name: "Fahrzeuge" },
  { id: "other", name: "Sonstiges" },
] as const;

export const templates: TemplateConfig[] = [
  { id: "crocodile", name: "Krokodil", category: "animals", svgFilename: "crocodile.svg", difficulty: "hard", recommendedDots: 200 },
  { id: "turtle", name: "Schildkroete", category: "animals", svgFilename: "turtle.svg", difficulty: "medium", recommendedDots: 150 },
  { id: "dolphin", name: "Delfin", category: "animals", svgFilename: "dolphin.svg", difficulty: "medium", recommendedDots: 120 },
  { id: "butterfly", name: "Schmetterling", category: "animals", svgFilename: "butterfly.svg", difficulty: "medium", recommendedDots: 150 },
  { id: "elephant", name: "Elefant", category: "animals", svgFilename: "elephant.svg", difficulty: "hard", recommendedDots: 180 },
  { id: "car", name: "Auto", category: "vehicles", svgFilename: "car.svg", difficulty: "easy", recommendedDots: 100 },
  { id: "airplane", name: "Flugzeug", category: "vehicles", svgFilename: "airplane.svg", difficulty: "medium", recommendedDots: 130 },
  { id: "ship", name: "Schiff", category: "vehicles", svgFilename: "ship.svg", difficulty: "easy", recommendedDots: 100 },
  { id: "star", name: "Stern", category: "other", svgFilename: "star.svg", difficulty: "easy", recommendedDots: 50 },
  { id: "house", name: "Haus", category: "other", svgFilename: "house.svg", difficulty: "easy", recommendedDots: 80 },
];

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): TemplateConfig | undefined {
  return templates.find((t) => t.id === id);
}
