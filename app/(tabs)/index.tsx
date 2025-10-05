import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RenderExercises } from "@/components/exercises/render-exercises";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TypeFilter } from "@/components/ui/trainings/type-filter";
import { ALL_TYPES, TRAINING_TYPES } from "@/constants/training";
import { filterTraining } from "@/lib/utils/filterUtils";
import { TrainingService } from "@/services/trainingService";
import { Training } from "@/types/training";

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(ALL_TYPES);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TrainingService.getAllTrainings();
      setTrainings(data);
      setFilteredTrainings(data);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити тренування");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterTrainings = () => {
    if (selectedType === ALL_TYPES) {
      setFilteredTrainings(trainings);
    } else {
      const filtered = trainings.filter(filterTraining(selectedType));
      setFilteredTrainings(filtered);
    }
  };

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
              setFilteredTrainings((prev) =>
                prev.filter((t) => t.id !== trainingId)
              );
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
  }, []);

  useEffect(() => {
    filterTrainings();
  }, [selectedType, trainings]);

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
        <Button
          title="Оновити"
          onPress={fetchTrainings}
          disabled={loading}
          icon="arrow.clockwise"
        />
      </View>

      <View style={styles.filtersContainer}>
        <TypeFilter
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          types={[ALL_TYPES, ...TRAINING_TYPES]}
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
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
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
