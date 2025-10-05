import { TrainingService } from "@/services/trainingService";
import { Training, TrainingsResponse } from "@/types/training";
import { useCallback, useState } from "react";

interface UsePaginationOptions {
  limit?: number;
}

interface UsePaginationReturn {
  trainings: Training[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  error: string | null;
}

export function usePagination({
  limit = 10,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const offset = trainings.length;
      const response: TrainingsResponse =
        await TrainingService.getPaginatedTrainings(limit, offset);

      setTrainings((prev) => [...prev, ...response.trainings]);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Не вдалося завантажити більше тренувань");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, trainings.length, limit]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: TrainingsResponse =
        await TrainingService.getPaginatedTrainings(limit, 0);

      setTrainings(response.trainings);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Не вдалося завантажити тренування");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return {
    trainings,
    loading,
    loadingMore,
    hasMore,
    totalCount,
    currentPage,
    totalPages,
    loadMore,
    refresh,
    error,
  };
}
