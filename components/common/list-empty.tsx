import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ListEmptyProps = {
  loading: boolean;
  selectedType?: string;
  searchQuery: string;
  emptyListFunction: (
    loading: boolean,
    searchQuery: string,
    selectedType?: string
  ) => string;
};

const ListEmpty: React.FC<ListEmptyProps> = ({
  loading = false,
  selectedType,
  searchQuery,
  emptyListFunction,
}: ListEmptyProps) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {emptyListFunction(loading, searchQuery, selectedType)}
      </Text>
    </View>
  );
};

export const getListEmpty = ({
  loading,
  searchQuery,
  selectedType,
  emptyListFunction,
}: ListEmptyProps) => (
  <ListEmpty
    loading={loading}
    searchQuery={searchQuery}
    selectedType={selectedType}
    emptyListFunction={emptyListFunction}
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
