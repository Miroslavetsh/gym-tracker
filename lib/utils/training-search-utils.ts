import { Training } from "@/types/training";
import { ALL_TYPES } from "../constants/training";
import { filterTrainingByType } from "./filter-utils";

export function searchInTraining(training: Training, query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  if (training.kind.toLowerCase().includes(lowerQuery)) return true;
  if (!training.exercises) return false;

  return training.exercises.some((exercise) => {
    if (Array.isArray(exercise)) {
      return exercise.some((ex) => ex.name.toLowerCase().includes(lowerQuery));
    } else {
      return exercise.name.toLowerCase().includes(lowerQuery);
    }
  });
}

export function filterTrainingsByType(
  trainings: Training[],
  selectedType: string
): Training[] {
  if (selectedType === ALL_TYPES) return trainings;
  return trainings.filter(filterTrainingByType(selectedType));
}

export function searchAndFilterTrainings(
  trainings: Training[],
  searchQuery: string,
  selectedType: string
): Training[] {
  console.log("searchAndFilterTrainings", searchQuery, selectedType);
  let filtered = filterTrainingsByType(trainings, selectedType);

  if (searchQuery.trim()) {
    filtered = filtered.filter((training) =>
      searchInTraining(training, searchQuery)
    );
  }

  return filtered;
}
