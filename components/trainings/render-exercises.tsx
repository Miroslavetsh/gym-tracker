import { Exercise } from "@/types/training";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const renderExercise = (exercise: Exercise) => (
  <View key={exercise.id} style={styles.exerciseItem}>
    <Text style={styles.exerciseName}>{exercise.name}</Text>
    <Text style={styles.exerciseDetails}>
      {exercise.sets} × {exercise.repetitions}
      {exercise.perSide && "по"}
      {exercise.weight && `${exercise.weight}кг`}
    </Text>
  </View>
);

type RenderExercisesProps = {
  exercises: Exercise[];
};

export const RenderExercises: React.FC<RenderExercisesProps> = ({
  exercises,
}) => {
  return (
    <View>
      {exercises?.map((exercise, index) => {
        const isSuperset = Array.isArray(exercise);
        if (isSuperset) {
          return (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>Сет</Text>
              {exercise.map(renderExercise)}
            </View>
          );
        }

        return renderExercise(exercise);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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
  emptyText: {
    fontSize: 18,
    color: "#8E8E93",
  },
});
