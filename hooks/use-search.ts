import { searchInObject } from "@/lib/utils/search-utils";
import { useCallback, useMemo, useState } from "react";

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

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => searchInObject(item, searchFields, query));
  }, [data, searchQuery, searchFields.join(',')]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch,
  };
}
