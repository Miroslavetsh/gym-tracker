import { Training } from "@/types/training";
import { useCallback, useEffect, useState } from "react";

interface UseTrainingFiltersOptions {
  trainings: Training[];
  initialType?: string;
  initialSearchQuery?: string;
}

interface UseTrainingFiltersReturn {
  selectedType: string;
  setSelectedType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTrainings: Training[];
  clearFilters: () => void;
}

export function useTrainingFilters({
  trainings,
  initialType = "Всі типи",
  initialSearchQuery = "",
}: UseTrainingFiltersOptions): UseTrainingFiltersReturn {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredTrainings, setFilteredTrainings] =
    useState<Training[]>(trainings);

  const filterTrainings = useCallback(() => {
    let filtered = trainings;


    if (selectedType !== "Всі типи") {
      filtered = filtered.filter((training) => training.kind === selectedType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((training) => {
        // Поиск по типу тренировки
        if (training.kind.toLowerCase().includes(query)) {
          return true;
        }

        // Поиск по упражнениям
        if (training.exercises) {
          return training.exercises.some((exercise) => {
            if (Array.isArray(exercise)) {
              // Для сетов упражнений
              return exercise.some((ex) =>
                ex.name.toLowerCase().includes(query)
              );
            } else {
              // Для обычных упражнений
              return exercise.name.toLowerCase().includes(query);
            }
          });
        }

        return false;
      });
    }

    setFilteredTrainings(filtered);
  }, [trainings, selectedType, searchQuery]);

  const clearFilters = useCallback(() => {
    setSelectedType("Всі типи");
    setSearchQuery("");
  }, []);

  useEffect(() => {
    filterTrainings();
  }, [filterTrainings]);

  return {
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    filteredTrainings,
    clearFilters,
  };
}
