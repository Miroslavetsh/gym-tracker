import { Training } from "@/types/training";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { RenderExercises } from "./render-exercises";

type RenderTrainingProps = {
  item: Training;
  handleDeleteTraining: (id: string) => void;
};

export const RenderTraining: React.FC<RenderTrainingProps> = ({
  item,
  handleDeleteTraining,
}) => (
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
