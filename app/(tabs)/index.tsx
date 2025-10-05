import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RenderExercises } from "@/components/trainings/render-exercises";
import { TypeFilter } from "@/components/trainings/type-filter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/input";
import { ALL_TYPES, TRAINING_TYPES } from "@/constants/training";
import { useTrainingFilters } from "@/hooks/use-training-filters";
import { TrainingService } from "@/services/trainingService";
import { Training } from "@/types/training";

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    filteredTrainings,
    clearFilters,
  } = useTrainingFilters({ trainings });

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TrainingService.getAllTrainings();
      setTrainings(data);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити тренування");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteTraining = async (trainingId: string) => {
    Alert.alert(
      "Видалити тренування",
      "Ви впевнені, що хочете видалити це тренування?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await TrainingService.deleteTraining(trainingId);
              setTrainings((prev) => prev.filter((t) => t.id !== trainingId));
            } catch (error) {
              Alert.alert("Помилка", "Не вдалося видалити тренування");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const renderTraining = ({ item }: { item: Training }) => (
    <Card style={styles.trainingCard}>
      <View style={styles.trainingHeader}>
        <Text style={styles.trainingKind}>{item.kind}</Text>
        <Text style={styles.trainingDate}>
          {new Date(item.date).toLocaleDateString("uk-UA")}
        </Text>
      </View>

      {item.exercises && item.exercises.length > 0 && (
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Вправи:</Text>
          <RenderExercises exercises={item.exercises} />
        </View>
      )}

      <View style={styles.trainingActions}>
        <Button
          title="Видалити"
          variant="danger"
          onPress={() => handleDeleteTraining(item.id)}
          style={styles.deleteButton}
          icon="trash"
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <IconSymbol
            name="calendar"
            size={24}
            color="#007AFF"
            style={styles.titleIcon}
          />
          <Text style={styles.title}>Мої тренування</Text>
        </View>
        <View style={styles.headerButtons}>
          <Button
            title="Оновити"
            onPress={fetchTrainings}
            disabled={loading}
            icon="arrow.clockwise"
            style={styles.refreshButton}
          />
          {(selectedType !== ALL_TYPES || searchQuery) && (
            <Button
              title="Очистити"
              onPress={clearFilters}
              variant="secondary"
              icon="trash"
              style={styles.clearButton}
            />
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <TypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          types={[ALL_TYPES, ...TRAINING_TYPES]}
        />

        <Input
          label="Пошук тренування"
          placeholder="Пошук по тренуваннях..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredTrainings}
        renderItem={renderTraining}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchTrainings}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedType === ALL_TYPES
                ? "Немає тренувань"
                : "Тренування не знайдено"}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInput: {
    marginTop: 12,
  },
  listContainer: {
    padding: 16,
  },
  trainingCard: {
    marginBottom: 16,
  },
  trainingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trainingKind: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  trainingDate: {
    fontSize: 14,
    color: "#8E8E93",
  },
  exercisesContainer: {
    marginBottom: 12,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000000",
  },
  trainingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
