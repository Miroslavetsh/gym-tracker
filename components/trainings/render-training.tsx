import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HighlightText } from "@/components/ui/highlight-text";
import { Training } from "@/types/training";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExercisesList } from "../exercises/exercises-list";

type RenderTrainingProps = {
  item: Training;
  handleDeleteTraining: (id: string) => void;
  searchQuery?: string;
};

export function RenderTraining({
  item,
  handleDeleteTraining,
  searchQuery = "",
}: RenderTrainingProps) {
  return (
    <Card style={styles.trainingCard}>
      <View style={styles.trainingHeader}>
        <HighlightText
          text={item.kind}
          searchQuery={searchQuery}
          style={styles.trainingKind}
        />
        <Text style={styles.trainingDate}>
          {new Date(item.date).toLocaleDateString("uk-UA")}
        </Text>
      </View>

      {item.exercises && item.exercises.length > 0 && (
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Вправи:</Text>
          <ExercisesList exercises={item.exercises} searchQuery={searchQuery} />
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
  trainingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
