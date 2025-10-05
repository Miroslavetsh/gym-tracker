import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./icon-symbol";

interface ComboBoxProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  loading?: boolean;
}

export function ComboBox({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Введіть або оберіть опцію",
  error,
  loading = false,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) {
      return [];
    }
    return options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onValueChange(text);
    setIsOpen(text.trim().length > 0);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onValueChange(option);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (inputValue.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleOptionPressIn = (option: string) => {
    setInputValue(option);
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isOpen && (
        <TouchableOpacity style={styles.dropdown} activeOpacity={1}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Завантаження...</Text>
            </View>
          ) : filteredOptions.length > 0 ? (
            <FlatList
              data={filteredOptions.slice(0, 5)}
              keyExtractor={(item) => item}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    value === item && styles.selectedOption,
                  ]}
                  onPressIn={() => handleOptionPressIn(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <IconSymbol
                      name="checkmark.circle.fill"
                      size={16}
                      color="#007AFF"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {inputValue.trim()
                  ? "Нічого не знайдено"
                  : "Введіть назву для пошуку"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative",
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000000",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000000",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 200,
    zIndex: 1001,
  },
  optionsList: {
    maxHeight: 200,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  selectedOption: {
    backgroundColor: "#F0F8FF",
  },
  optionText: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
