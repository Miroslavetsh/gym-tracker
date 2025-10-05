import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TRAINING_TYPES } from "@/constants/training";
import { ExerciseService } from "@/services/exerciseService";

const allTypes = "Всі типи";

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(allTypes);

  const exerciseTypes = [allTypes, ...TRAINING_TYPES];

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await ExerciseService.getAllExercises();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити вправи");
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchQuery.trim()) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== allTypes) {
      filtered = filtered.filter((exercise) => exercise.type === selectedType);
    }

    setFilteredExercises(filtered);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedType, exercises]);

  const renderExercise = ({ item }: { item: any }) => (
    <Card style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      {item.type && <Text style={styles.exerciseType}>{item.type}</Text>}
    </Card>
  );

  const renderTypeButton = (type: string) => (
    <Button
      key={type}
      title={type}
      variant={selectedType === type ? "primary" : "secondary"}
      onPress={() => setSelectedType(type)}
      style={styles.typeButton}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <IconSymbol
            name="figure.strengthtraining.traditional"
            size={24}
            color="#007AFF"
            style={styles.titleIcon}
          />
          <Text style={styles.title}>Таблиця вправ</Text>
        </View>
        <Text style={styles.subtitle}>
          Перегляд та редагування всіх вправ з можливістю фільтрації та пошуку
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <Input
          label="Пошук вправи"
          placeholder="Пошук по назві вправи..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />

        <View style={styles.typeFilters}>
          <Text style={styles.filterLabel}>Тип навантаження</Text>
          <View style={styles.typeButtons}>
            {exerciseTypes.map(renderTypeButton)}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchExercises}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedType !== allTypes
                ? "Вправи не знайдено"
                : "Немає вправ"}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInput: {
    marginBottom: 16,
  },
  typeFilters: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  typeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
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
