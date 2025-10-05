import { Training } from "@/types/training";

const compareStrings = (str1: string, str2: string) =>
  str1.toLowerCase() === str2.toLowerCase();

export const filterTrainingByType = (selectedType: string) => (training: Training) =>
  compareStrings(training.kind, selectedType);
