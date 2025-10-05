export const TRAINING_TYPES = ["Верх", "Ноги", "Спина", "Груди", "Плечі", "Руки"] as const;

export type TrainingType = typeof TRAINING_TYPES[number];