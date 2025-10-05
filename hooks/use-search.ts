import { searchInObject } from "@/lib/utils/search-utils";
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
    const filtered = data.filter((item) => searchInObject(item, searchFields, query));

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
