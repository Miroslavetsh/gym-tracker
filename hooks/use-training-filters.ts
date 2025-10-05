import { searchAndFilterTrainings } from "@/lib/utils/training-search-utils";
import { Training } from "@/types/training";
import { useCallback, useMemo, useState } from "react";

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

  const filteredTrainings = useMemo(() => {
    return searchAndFilterTrainings(trainings, searchQuery, selectedType);
  }, [trainings, searchQuery, selectedType]);

  const clearFilters = useCallback(() => {
    setSelectedType("Всі типи");
    setSearchQuery("");
  }, []);

  return {
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    filteredTrainings,
    clearFilters,
  };
}
