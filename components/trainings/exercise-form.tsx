import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComboBox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import { ExerciseService } from "@/services/exerciseService";
import { ExerciseDto } from "@/types/training";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ExerciseFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseDto) => void;
  initialData?: ExerciseDto;
};

export function ExerciseForm({
  visible,
  onClose,
  onSave,
  initialData,
}: ExerciseFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [repetitions, setRepetitions] = useState(
    initialData?.repetitions?.toString() || ""
  );
  const [sets, setSets] = useState(initialData?.sets?.toString() || "");
  const [weight, setWeight] = useState(initialData?.weight?.toString() || "");
  const [perSide, setPerSide] = useState(initialData?.perSide || false);
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);

  const setsInputRef = useRef<any>(null);
  const repetitionsInputRef = useRef<any>(null);
  const weightInputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      loadExerciseOptions();
    }
  }, [visible]);

  const loadExerciseOptions = async () => {
    setLoadingExercises(true);
    try {
      const exercises = await ExerciseService.getAllUniq();
      const exerciseNames = exercises.map((exercise) => exercise.name);
      setExerciseOptions(exerciseNames);
    } catch (error) {
      console.error("Failed to load exercises:", error);
      setExerciseOptions([]);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Помилка", "Введіть назву вправи");
      return;
    }

    if (!repetitions || !sets) {
      Alert.alert("Помилка", "Введіть кількість повторень та сетів");
      return;
    }

    const exercise: ExerciseDto = {
      name: name.trim(),
      repetitions: parseInt(repetitions),
      sets: parseInt(sets),
      weight: parseFloat(weight) || 0,
      perSide,
    };

    onSave(exercise);
    handleClose();
  };

  const handleClose = () => {
    setName(initialData?.name || "");
    setRepetitions(initialData?.repetitions?.toString() || "");
    setSets(initialData?.sets?.toString() || "");
    setWeight(initialData?.weight?.toString() || "");
    setPerSide(initialData?.perSide || false);
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
          <Text style={styles.title}>
            {initialData ? "Редагувати вправу" : "Додати вправу"}
          </Text>
          <Button title="Скасувати" variant="secondary" onPress={handleClose} />
        </View>

        <Card style={styles.formCard}>
          <ComboBox
            label="Назва вправи *"
            value={name}
            onValueChange={setName}
            options={exerciseOptions}
            placeholder="Наприклад: Присідання зі штангою"
            loading={loadingExercises}
          />

          <Input
            ref={setsInputRef}
            label="Кількість сетів *"
            placeholder="0"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => repetitionsInputRef.current?.focus()}
          />

          <Input
            ref={repetitionsInputRef}
            label="Повторення *"
            placeholder="0"
            value={repetitions}
            onChangeText={setRepetitions}
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => weightInputRef.current?.focus()}
          />

          <Input
            ref={weightInputRef}
            label="Вага (кг)"
            placeholder="0"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            returnKeyType="done"
          />

          <View style={styles.checkboxContainer}>
            <Button
              title={
                perSide
                  ? "✓ Навантаження на кожну сторону"
                  : "Навантаження на кожну сторону"
              }
              variant={perSide ? "primary" : "secondary"}
              onPress={() => setPerSide(!perSide)}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxDescription}>
              Встановіть, якщо вказана вага розрахована на одну сторону
              (наприклад, гантелі)
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title={initialData ? "Оновити вправу" : "Зберегти вправу"}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </Card>
      </SafeAreaView>
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
  formCard: {
    margin: 16,
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
