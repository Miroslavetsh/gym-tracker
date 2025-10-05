import { HighlightText } from "@/components/ui/highlight-text";
import { Exercise, ExerciseDto, ExerciseOrSupersetDto } from "@/types/training";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const getExerciseKey = (exercise: Exercise | ExerciseDto) => {
  if ("id" in exercise) return exercise.id;
  return exercise?.name;
};

export const renderExercise = (
  exercise: Exercise | ExerciseDto,
  searchQuery: string = ""
) => (
  <View key={getExerciseKey(exercise)} style={styles.exerciseItem}>
    <HighlightText
      text={exercise.name}
      searchQuery={searchQuery}
      style={styles.exerciseName}
    />
    <Text style={styles.exerciseDetails}>
      {exercise.sets} × {exercise.repetitions} {exercise.perSide && "по "}
      {exercise.weight > 0 && `${exercise.weight}кг`}
    </Text>
  </View>
);

type ExercisesListProps = {
  exercises: Exercise[] | ExerciseDto[] | ExerciseOrSupersetDto[];
  searchQuery?: string;
};

export const ExercisesList: React.FC<ExercisesListProps> = ({
  exercises,
  searchQuery = "",
}) => (
  <View>
    {exercises?.map((exercise, index) => {
      const isSuperset = Array.isArray(exercise);
      if (isSuperset) {
        return (
          <View key={index} style={styles.supersetContainer}>
            <Text style={styles.supersetTitle}>Сет</Text>
            {exercise.map((ex) => renderExercise(ex, searchQuery))}
          </View>
        );
      }

      return renderExercise(exercise, searchQuery);
    })}
  </View>
);

const styles = StyleSheet.create({
  exerciseItem: {
    marginLeft: 8,
    marginBottom: 4,
  },
  supersetTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 4,
  },
  supersetContainer: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#007AFF",
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
