import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExercisesList } from "@/components/exercises/exercises-list";
import { ActionButtons } from "@/components/trainings/action-buttons";
import { ExerciseForm } from "@/components/trainings/exercise-form";
import { SupersetForm } from "@/components/trainings/superset-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Select } from "@/components/ui/select";
import { TRAINING_TYPES } from "@/lib/constants/training";
import { TrainingService } from "@/services/trainingService";
import {
  CreateTrainingRequest,
  ExerciseDto,
  ExerciseOrSupersetDto,
} from "@/types/training";

export default function AddTrainingScreen() {
  const [kind, setKind] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercises, setExercises] = useState<ExerciseOrSupersetDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showSupersetForm, setShowSupersetForm] = useState(false);

  const handleAddExercise = (exercise: ExerciseDto) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const handleAddSuperset = (superset: ExerciseDto[]) => {
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
            Новий тренувальний день з усіма вправами
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Select
            label="Тип тренування *"
            value={kind}
            onValueChange={setKind}
            options={TRAINING_TYPES}
            placeholder="Оберіть тип тренування"
          />

          <DatePicker
            label="Дата тренування"
            value={date}
            onValueChange={setDate}
            placeholder="Оберіть дату тренування"
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
                variant="success"
                onPress={() => setShowSupersetForm(true)}
                style={styles.addButton}
                icon="link"
              />
            </View>

            <ExercisesList exercises={exercises} />
          </View>

          <ActionButtons
            onSave={handleSaveTraining}
            onClear={handleClearAll}
            loading={loading}
            saveButtonTitle="Зберегти"
            clearButtonTitle="Очистити все"
          />
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
});
