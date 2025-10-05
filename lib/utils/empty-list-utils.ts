import { ALL_TYPES } from "../constants/training";

export const getEmptyTrainingListState = (
  loading: boolean,
  searchQuery: string,
  selectedType?: string
) => {
  if (loading) return "Завантаження...";
  if (searchQuery) return "Тренування не знайдено";
  if (selectedType === ALL_TYPES) return "Немає тренувань";
  return "Немає тренувань";
};

export const getEmptyExerciseListState = (
  loading: boolean,
  searchQuery: string
) => {
  if (loading) return "Завантаження...";
  if (searchQuery) return "Вправи не знайдено";
  return "Немає вправ";
};
