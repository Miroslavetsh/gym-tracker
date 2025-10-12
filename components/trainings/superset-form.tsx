import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExerciseDto } from "@/types/training";

import { renderExercise } from "../exercises/exercises-list";
import { ExerciseForm } from "./exercise-form";

type SupersetFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (exercises: ExerciseDto[]) => void;
};

export function SupersetForm({ visible, onClose, onSave }: SupersetFormProps) {
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const addExercise = () => {
    setShowExerciseForm(true);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExerciseSave = (exercise: ExerciseDto) => {
    setExercises((prev) => [...prev, exercise]);
    setShowExerciseForm(false);
  };

  const handleSave = () => {
    if (exercises.length === 0) {
      Alert.alert("Помилка", "Додайте хоча б одну вправу до сету");
      return;
    }

    onSave(exercises);
    handleClose();
  };

  const handleClose = () => {
    setExercises([]);
    setShowExerciseForm(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Додати сет</Text>
          <Button title="Скасувати" variant="secondary" onPress={handleClose} />
        </View>

        <View style={styles.content}>
          <View style={styles.addButtonContainer}>
            <Button
              title="Додати вправу до сету"
              onPress={addExercise}
              style={styles.addButton}
            />
          </View>

          {exercises.map((exercise, index) => (
            <Card key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>
                  Вправа {index + 1}: {exercise.name}
                </Text>
                <View style={styles.exerciseActions}>
                  <Button
                    title="Видалити"
                    variant="danger"
                    onPress={() => removeExercise(index)}
                    style={styles.deleteButton}
                  />
                </View>
              </View>
              {renderExercise(exercise)}
            </Card>
          ))}

          {exercises.length > 0 && (
            <View style={styles.actionButtons}>
              <Button
                title="Зберегти сет"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          )}
        </View>
      </SafeAreaView>

      <ExerciseForm
        visible={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
        }}
        onSave={handleExerciseSave}
      />
    </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addButtonContainer: {
    marginBottom: 16,
  },
  addButton: {
    width: "100%",
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  exerciseActions: {
    flexDirection: "row",
    gap: 8,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  exerciseDetails: {
    marginTop: 8,
  },
  exerciseInfo: {
    fontSize: 14,
    color: "#8E8E93",
  },
  actionButtons: {
    marginTop: 16,
  },
  saveButton: {
    width: "100%",
  },
});
