import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseForm } from "@/components/ExerciseForm";
import { SupersetForm } from "@/components/SupersetForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { TrainingService } from "@/services/trainingService";
import {
  CreateTrainingRequest,
  Exercise,
  ExerciseOrSuperset,
} from "@/types/training";

export default function AddTrainingScreen() {
  const [kind, setKind] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercises, setExercises] = useState<ExerciseOrSuperset[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showSupersetForm, setShowSupersetForm] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const handleAddSuperset = (superset: Exercise[]) => {
    setExercises((prev) => [...prev, superset]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveTraining = async () => {
    if (!kind.trim()) {
      Alert.alert("Помилка", "Оберіть тип тренування");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Помилка", "Додайте хоча б одну вправу");
      return;
    }

    setLoading(true);
    try {
      const trainingData: CreateTrainingRequest = {
        kind,
        date: new Date(date).toISOString(),
        exercises,
        accountId: "3faf93a3-a2e3-45af-b0c2-da7ec66356e5",
      };

      await TrainingService.createTraining(trainingData);
      Alert.alert("Успіх", "Тренування збережено!", [
        {
          text: "OK",
          onPress: () => {
            setKind("");
            setDate(new Date().toISOString().split("T")[0]);
            setExercises([]);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося зберегти тренування");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    Alert.alert("Очистити все", "Ви впевнені, що хочете очистити всі дані?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Очистити",
        style: "destructive",
        onPress: () => {
          setKind("");
          setDate(new Date().toISOString().split("T")[0]);
          setExercises([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconSymbol
              name="plus.circle.fill"
              size={24}
              color="#007AFF"
              style={styles.titleIcon}
            />
            <Text style={styles.title}>Додати тренування</Text>
          </View>
          <Text style={styles.subtitle}>
            Створіть новий тренувальний день з усіма необхідними деталями
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Тип тренування *"
            placeholder="Оберіть тип тренування"
            value={kind}
            onChangeText={setKind}
          />

          <Input
            label="Дата тренування"
            value={date}
            onChangeText={setDate}
            keyboardType="numeric"
          />

          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Вправи *</Text>

            <View style={styles.addButtons}>
              <Button
                title="Додати вправу"
                onPress={() => setShowExerciseForm(true)}
                style={styles.addButton}
                icon="plus"
              />
              <Button
                title="Додати сет"
                variant="secondary"
                onPress={() => setShowSupersetForm(true)}
                style={styles.addButton}
                icon="link"
              />
            </View>

            {exercises.map((item: ExerciseOrSuperset, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>
                    {Array.isArray(item)
                      ? `Сет ${index + 1}`
                      : `Вправа ${index + 1}`}
                  </Text>
                  <Button
                    title="Видалити"
                    variant="danger"
                    onPress={() => handleRemoveExercise(index)}
                    style={styles.deleteButton}
                    icon="trash"
                  />
                </View>

                {Array.isArray(item) ? (
                  <View style={styles.supersetContent}>
                    <Text style={styles.supersetTitle}>
                      Вправи в сеті ({item.length})
                    </Text>
                    {item.map((exercise, exerciseIndex) => (
                      <View key={exerciseIndex} style={styles.supersetExercise}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDetails}>
                          {exercise.sets} × {exercise.repetitions}
                          {exercise.weight > 0 && ` @ ${exercise.weight}кг`}
                          {exercise.perSide && " (на сторону)"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {item.sets} × {item.repetitions}
                      {item.weight > 0 && ` @ ${item.weight}кг`}
                      {item.perSide && " (на сторону)"}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Зберегти тренування"
              onPress={handleSaveTraining}
              disabled={loading}
              style={styles.saveButton}
              icon="checkmark.circle.fill"
            />
            <Button
              title="Очистити все"
              variant="secondary"
              onPress={handleClearAll}
              style={styles.clearButton}
              icon="trash"
            />
          </View>
        </Card>

        <Card style={styles.previewCard}>
          <Text style={styles.previewTitle}>
            Попередній перегляд тренування
          </Text>
          {kind && (
            <View style={styles.previewContent}>
              <View style={styles.previewTag}>
                <Text style={styles.previewTagText}>{kind}</Text>
              </View>
              <Text style={styles.previewDate}>
                {new Date(date).toLocaleDateString("uk-UA")}
              </Text>
              {exercises.length > 0 && (
                <Text style={styles.previewExercises}>
                  Вправ: {exercises.length}
                </Text>
              )}
            </View>
          )}
        </Card>

        <ExerciseForm
          visible={showExerciseForm}
          onClose={() => setShowExerciseForm(false)}
          onSave={handleAddExercise}
        />

        <SupersetForm
          visible={showSupersetForm}
          onClose={() => setShowSupersetForm(false)}
          onSave={handleAddSuperset}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
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
  formCard: {
    margin: 16,
  },
  exercisesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000000",
  },
  addButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
  },
  exerciseItem: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  exerciseContent: {
    marginLeft: 8,
  },
  supersetContent: {
    marginLeft: 8,
  },
  supersetTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 8,
  },
  supersetExercise: {
    marginLeft: 8,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
  previewCard: {
    margin: 16,
    marginTop: 0,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000000",
  },
  previewContent: {
    alignItems: "flex-start",
  },
  previewTag: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  previewTagText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  previewDate: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  previewExercises: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
