import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Training } from "@/types/training";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RenderTrainingProps {
  item: Training;
  handleDeleteTraining: (id: string) => void;
}

export function RenderTraining({
  item,
  handleDeleteTraining,
}: RenderTrainingProps) {
  return (
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
          {item.exercises.map((exercise, index) => {
            if (Array.isArray(exercise)) {
              return (
                <View key={index} style={styles.supersetContainer}>
                  <Text style={styles.supersetTitle}>Сет</Text>
                  {exercise.map((ex, exIndex) => (
                    <View key={exIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{ex.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {ex.sets} × {ex.repetitions}
                        {ex.weight && ex.weight > 0 && ` @ ${ex.weight}кг`}
                        {ex.perSide && " (на сторону)"}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            } else {
              return (
                <View key={index} style={styles.exerciseItem}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {exercise.sets} × {exercise.repetitions}
                    {exercise.weight &&
                      exercise.weight > 0 &&
                      ` @ ${exercise.weight}кг`}
                    {exercise.perSide && " (на сторону)"}
                  </Text>
                </View>
              );
            }
          })}
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
}

const styles = StyleSheet.create({
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
  supersetContainer: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#007AFF",
  },
  supersetTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 4,
  },
  exerciseItem: {
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
  trainingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
