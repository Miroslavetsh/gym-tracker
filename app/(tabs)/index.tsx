import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/common/header";
import { RenderTraining } from "@/components/trainings/render-training";
import { TypeFilter } from "@/components/trainings/type-filter";
import { Input } from "@/components/ui/input";
import { useTrainingFilters } from "@/hooks/use-training-filters";
import { ALL_TYPES, TRAINING_TYPES } from "@/lib/constants/training";
import { TrainingService } from "@/services/trainingService";
import { Training } from "@/types/training";

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);

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

  const toggleFilters = () => setFiltersVisible((prev) => !prev);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Мої тренування"
        icon="calendar"
        onClear={clearFilters}
        onToggleFilters={toggleFilters}
        showClearButton={selectedType !== ALL_TYPES || !!searchQuery}
        showToggleFiltersButton={true}
        filtersVisible={filtersVisible}
      />

      {filtersVisible && (
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
      )}

      <FlatList
        data={filteredTrainings}
        renderItem={({ item }) => (
          <RenderTraining
            item={item}
            handleDeleteTraining={handleDeleteTraining}
          />
        )}
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
