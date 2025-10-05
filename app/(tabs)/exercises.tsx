import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/common/header";
import { renderExercise } from "@/components/trainings/render-exercises";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { ExerciseService } from "@/services/exerciseService";
import { Exercise } from "@/types/training";

const SEARCH_FIELDS: (keyof Exercise)[] = ["name", "weight", "repetitions"];

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredExercises,
  } = useSearch<Exercise>({
    data: exercises,
    searchFields: SEARCH_FIELDS,
  });

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ExerciseService.getAll();
      setExercises(data);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити вправи");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Таблиця вправ"
        icon="figure.strengthtraining.traditional"
      />

      <View style={styles.filtersContainer}>
        <Input
          label="Пошук вправи"
          placeholder="Пошук по назві вправи..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={({ item }) => renderExercise(item)}
        keyExtractor={(item) => Object.values(item).join("-")}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchExercises}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? "Вправи не знайдено" : "Немає вправ"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInput: {
    marginBottom: 0,
  },
  listContainer: {
    padding: 16,
  },
  exerciseCard: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  exerciseType: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#8E8E93",
  },
});
