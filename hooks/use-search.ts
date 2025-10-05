import { useCallback, useEffect, useState } from "react";

interface UseSearchOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  initialSearchQuery?: string;
}

interface UseSearchReturn<T> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredData: T[];
  clearSearch: () => void;
}

export function useSearch<T>({
  data,
  searchFields,
  initialSearchQuery = "",
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const filterData = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = data.filter((item) => {
      return searchFields.some((field) => {
        const fieldValue = item[field];
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(query);
        }
        return false;
      });
    });

    setFilteredData(filtered);
  }, [data, searchQuery, searchFields]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  useEffect(() => {
    filterData();
  }, [filterData]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch,
  };
}
