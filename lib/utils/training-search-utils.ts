import { Training } from "@/types/training";

export function searchInTraining(training: Training, query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();

  if (training.kind.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  if (training.exercises) {
    return training.exercises.some((exercise) => {
      if (Array.isArray(exercise)) {
        return exercise.some((ex) => ex.name.toLowerCase().includes(lowerQuery));
      } else {
        return exercise.name.toLowerCase().includes(lowerQuery);
      }
    });
  }

  return false;
}

export function filterTrainingsByType(trainings: Training[], selectedType: string): Training[] {
  if (selectedType === "Всі типи") {
    return trainings;
  }
  return trainings.filter((training) => training.kind === selectedType);
}

export function searchAndFilterTrainings(
  trainings: Training[],
  searchQuery: string,
  selectedType: string
): Training[] {
  let filtered = filterTrainingsByType(trainings, selectedType);

  if (searchQuery.trim()) {
    filtered = filtered.filter((training) => searchInTraining(training, searchQuery));
  }

  return filtered;
}
