import { ALL_TYPES } from "@/lib/constants/training";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const getEmptyListState = (
  loading: boolean,
  selectedType: string,
  searchQuery: string
) => {
  if (loading) return "Завантаження...";
  if (searchQuery) return "Тренування не знайдено";
  if (selectedType === ALL_TYPES) return "Немає тренувань";
  return "Тренування не знайдено";
};

const ListEmpty = ({
  loading = false,
  selectedType,
  searchQuery,
}: {
  loading: boolean;
  selectedType: string;
  searchQuery: string;
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {getEmptyListState(loading, selectedType, searchQuery)}
      </Text>
    </View>
  );
};

export const getListEmpty = (
  loading: boolean,
  selectedType: string,
  searchQuery: string
) => (
  <ListEmpty
    loading={loading}
    selectedType={selectedType}
    searchQuery={searchQuery}
  />
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#8E8E93",
  },
});
