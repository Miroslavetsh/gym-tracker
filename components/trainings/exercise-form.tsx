import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExerciseDto } from "@/types/training";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";

type ExerciseFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (exercise: ExerciseDto) => void;
};

export function ExerciseForm({ visible, onClose, onSave }: ExerciseFormProps) {
  const [name, setName] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [perSide, setPerSide] = useState(false);

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
    setName("");
    setRepetitions("");
    setSets("");
    setWeight("");
    setPerSide(false);
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
          <Text style={styles.title}>Додати вправу</Text>
          <Button title="Скасувати" variant="secondary" onPress={handleClose} />
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Назва вправи *"
            placeholder="Наприклад: Присідання зі штангою"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Кількість сетів *"
            placeholder="0"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
          />

          <Input
            label="Повторення *"
            placeholder="0"
            value={repetitions}
            onChangeText={setRepetitions}
            keyboardType="numeric"
          />

          <Input
            label="Вага (кг)"
            placeholder="0"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
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
              title="Зберегти вправу"
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
        </Card>
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
