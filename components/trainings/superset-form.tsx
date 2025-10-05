import { Button } from "@/components/ui/button";
import { ExerciseDto } from "@/types/training";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { RenderExercises } from "./render-exercises";

type SupersetFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (exercises: ExerciseDto[]) => void;
};

export function SupersetForm({ visible, onClose, onSave }: SupersetFormProps) {
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);

  const addExercise = () => {
    const newExercise: ExerciseDto = {
      name: "",
      repetitions: 0,
      sets: 0,
      weight: 0,
      perSide: false,
    };
    setExercises((prev) => [...prev, newExercise]);
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseDto,
    value: any
  ) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validExercises = exercises.filter(
      (ex) => ex.name.trim() && ex.repetitions > 0 && ex.sets > 0
    );

    if (validExercises.length === 0) {
      Alert.alert("Помилка", "Додайте хоча б одну вправу до сету");
      return;
    }

    onSave(validExercises);
    handleClose();
  };

  const handleClose = () => {
    setExercises([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
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

          <RenderExercises exercises={exercises} />

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
      </View>
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
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  checkboxContainer: {
    marginTop: 8,
  },
  checkbox: {
    marginBottom: 8,
  },
  checkboxDescription: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 8,
  },
  actionButtons: {
    marginTop: 16,
  },
  saveButton: {
    width: "100%",
  },
});
