import { Exercise, Training } from "@/types/training";
import { useCallback, useEffect, useMemo, useState } from "react";
import { compareDates, formatDateStable } from "@/lib/utils/date-utils";
import { TrainingService } from "@/services/trainingService";

export interface ExerciseRecord {
  id: string;
  name: string;
  date: string;
  weight: number | null;
  repetitions: number | null;
  sets: number;
  perSide: boolean;
}

export function useExerciseProgress() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TrainingService.getAllTrainings();
      setTrainings(data ?? []);
    } catch (err) {
      setError("Не вдалося завантажити тренування");
      setTrainings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const records: ExerciseRecord[] = useMemo(() => {
    const out: ExerciseRecord[] = [];
    for (const t of trainings) {
      const date = t.date;
      if (!t.exercises?.length) continue;
      for (const ex of t.exercises) {
        const single = ex as Exercise;
        if (single?.name != null) {
          out.push({
            id: single.id,
            name: single.name,
            date,
            weight: single.weight ?? null,
            repetitions: single.repetitions ?? null,
            sets: single.sets ?? 0,
            perSide: single.perSide ?? false,
          });
        }
      }
    }
    return out;
  }, [trainings]);

  const uniqueExerciseNames = useMemo(() => {
    const set = new Set(records.map((r) => r.name));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const getDataForExercise = useCallback(
    (exerciseName: string) => {
      const filtered = records
        .filter((r) => r.name === exerciseName)
        .sort((a, b) => compareDates(a.date, b.date));
      return filtered;
    },
    [records],
  );

  const getChartDataForExercise = useCallback(
    (exerciseName: string, showWeight: boolean, showRepetitions: boolean) => {
      const filtered = getDataForExercise(exerciseName);
      if (filtered.length === 0) return [];

      return filtered.map((ex) => ({
        x: formatDateStable(ex.date),
        date: ex.date,
        weight: showWeight ? ex.weight : null,
        repetitions: showRepetitions ? ex.repetitions : null,
      }));
    },
    [getDataForExercise],
  );

  return {
    records,
    uniqueExerciseNames,
    getDataForExercise,
    getChartDataForExercise,
    loading,
    error,
    refresh: fetchAll,
  };
}
