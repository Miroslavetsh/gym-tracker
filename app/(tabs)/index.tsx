import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/common/header";
import { RenderTraining } from "@/components/trainings/render-training";
import { TypeFilter } from "@/components/trainings/type-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { useTrainingFilters } from "@/hooks/use-training-filters";
import { ALL_TYPES, TRAINING_TYPES } from "@/lib/constants/training";
import { TrainingService } from "@/services/trainingService";

export default function TrainingsScreen() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const {
    trainings,
    loading,
    loadingMore,
    hasMore,
    totalCount,
    loadMore,
    refresh,
    error,
  } = usePagination({ limit: 10 });
  const {
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,
    filteredTrainings,
  } = useTrainingFilters({ trainings });

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
              await refresh();
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
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container}>
      {error && <View>Alert.alert("Помилка", error)</View>}
      <Header
        title={`Мої тренування ${totalCount > 0 && `(${totalCount})`}`}
        icon="calendar"
        onToggleFilters={toggleFilters}
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
        onRefresh={refresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedType === ALL_TYPES
                ? "Немає тренувань"
                : "Тренування не знайдено"}
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            {hasMore && filteredTrainings.length > 0 && (
              <View style={styles.loadMoreContainer}>
                <Button
                  title="Завантажити ще"
                  onPress={loadMore}
                  disabled={loadingMore}
                  variant="secondary"
                  style={styles.loadMoreButton}
                />
              </View>
            )}
          </>
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
  loadMoreContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 18,
    color: "#8E8E93",
  },
});
