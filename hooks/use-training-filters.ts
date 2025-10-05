import { ALL_TYPES } from "@/lib/constants/training";
import { searchAndFilterTrainings } from "@/lib/utils/training-search-utils";
import { Training } from "@/types/training";
import { useMemo, useState } from "react";

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
}

export function useTrainingFilters({
  trainings,
  initialType = ALL_TYPES,
  initialSearchQuery = "",
}: UseTrainingFiltersOptions): UseTrainingFiltersReturn {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const filteredTrainings = useMemo(
    () => searchAndFilterTrainings(trainings, searchQuery, selectedType),
    [trainings, searchQuery, selectedType]
  );

  return {
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    filteredTrainings,
  };
}
