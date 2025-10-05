import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../ui/button";

type TypeFilterProps = {
  selectedType: string;
  onTypeChange: (type: string) => void;
  types: string[];
};

export const TypeFilter: React.FC<TypeFilterProps> = ({
  selectedType,
  onTypeChange,
  types,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>Тип навантаження</Text>
    <View style={styles.buttonsContainer}>
      {types.map((type) => (
        <Button
          key={type}
          title={type}
          variant={selectedType === type ? "primary" : "secondary"}
          onPress={() => onTypeChange(type)}
          style={styles.typeButton}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
