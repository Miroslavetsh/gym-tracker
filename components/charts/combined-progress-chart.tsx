import { formatDateStable } from "@/lib/utils/date-utils";
import { useExerciseProgress } from "@/hooks/use-exercise-progress";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Select } from "@/components/ui/select";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

const chartTheme = VictoryTheme.material;

export function CombinedProgressChart() {
  const [selectedExercise, setSelectedExercise] = useState("");
  const [showWeight, setShowWeight] = useState(true);
  const [showRepetitions, setShowRepetitions] = useState(true);

  const {
    uniqueExerciseNames,
    getDataForExercise,
    getChartDataForExercise,
    loading,
    error,
  } = useExerciseProgress();

  const exerciseData = useMemo(
    () => (selectedExercise ? getDataForExercise(selectedExercise) : []),
    [selectedExercise, getDataForExercise],
  );

  const chartData = useMemo(() => {
    const raw = getChartDataForExercise(
      selectedExercise,
      showWeight,
      showRepetitions,
    );
    return raw.map((d) => ({
      x: d.x,
      weight: d.weight != null ? d.weight : undefined,
      repetitions: d.repetitions != null ? d.repetitions : undefined,
    }));
  }, [selectedExercise, showWeight, showRepetitions, getChartDataForExercise]);

  const statistics = useMemo(() => {
    if (exerciseData.length === 0) return null;
    const weightData = exerciseData.filter((ex) => ex.weight != null);
    const repetitionsData = exerciseData.filter((ex) => ex.repetitions != null);
    return {
      totalRecords: exerciseData.length,
      weightRecords: weightData.length,
      repetitionsRecords: repetitionsData.length,
      firstDate: exerciseData[0]?.date,
      lastDate: exerciseData[exerciseData.length - 1]?.date,
      minWeight:
        weightData.length > 0
          ? Math.min(...weightData.map((ex) => ex.weight as number))
          : null,
      maxWeight:
        weightData.length > 0
          ? Math.max(...weightData.map((ex) => ex.weight as number))
          : null,
      minRepetitions:
        repetitionsData.length > 0
          ? Math.min(...repetitionsData.map((ex) => ex.repetitions as number))
          : null,
      maxRepetitions:
        repetitionsData.length > 0
          ? Math.max(...repetitionsData.map((ex) => ex.repetitions as number))
          : null,
      avgRepetitions:
        repetitionsData.length > 0
          ? Math.round(
              repetitionsData.reduce(
                (sum, ex) => sum + (ex.repetitions ?? 0),
                0,
              ) / repetitionsData.length,
            )
          : null,
    };
  }, [exerciseData]);

  const yKeys = useMemo(() => {
    const keys: ("weight" | "repetitions")[] = [];
    if (showWeight) keys.push("weight");
    if (showRepetitions) keys.push("repetitions");
    return keys;
  }, [showWeight, showRepetitions]);

  const weightLineData = useMemo(
    () =>
      chartData
        .map((d, i) => ({ x: i + 1, y: d.weight }))
        .filter((d) => d.y != null) as { x: number; y: number }[],
    [chartData],
  );
  const repetitionsLineData = useMemo(
    () =>
      chartData
        .map((d, i) => ({ x: i + 1, y: d.repetitions }))
        .filter((d) => d.y != null) as { x: number; y: number }[],
    [chartData],
  );
  const xAxisTickFormat = (t: number) => {
    const i = Math.round(t) - 1;
    return chartData[i]?.x ?? String(t);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження даних...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.label}>Виберіть вправу</Text>
        <Select
          label="Вправа"
          value={selectedExercise}
          onValueChange={setSelectedExercise}
          options={uniqueExerciseNames}
          placeholder="Оберіть вправу..."
        />
      </View>

      {selectedExercise && (
        <>
          <View style={styles.toggles}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Показати вагу</Text>
              <Switch
                value={showWeight}
                onValueChange={setShowWeight}
                trackColor={{ false: "#E5E5EA", true: "#34C759" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Показати повторення</Text>
              <Switch
                value={showRepetitions}
                onValueChange={setShowRepetitions}
                trackColor={{ false: "#E5E5EA", true: "#3B82F6" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {statistics && (
            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>Вправа: {selectedExercise}</Text>
              <Text style={styles.statsRow}>
                Записів: {statistics.totalRecords}
              </Text>
              <Text style={styles.statsRow}>
                З вагою: {statistics.weightRecords} | З повтореннями:{" "}
                {statistics.repetitionsRecords}
              </Text>
              {statistics.firstDate && statistics.lastDate && (
                <Text style={styles.statsRow}>
                  {formatDateStable(statistics.firstDate)} –{" "}
                  {formatDateStable(statistics.lastDate)}
                </Text>
              )}
              {statistics.minWeight != null && statistics.maxWeight != null && (
                <Text style={styles.statsRow}>
                  Вага: {statistics.minWeight} – {statistics.maxWeight} кг
                </Text>
              )}
              {statistics.minRepetitions != null &&
                statistics.maxRepetitions != null && (
                  <Text style={styles.statsRow}>
                    Повторення: {statistics.minRepetitions} –{" "}
                    {statistics.maxRepetitions}
                    {statistics.avgRepetitions != null &&
                      ` (середнє ${statistics.avgRepetitions})`}
                  </Text>
                )}
            </View>
          )}

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>
              {selectedExercise
                ? `Прогрес: ${selectedExercise}`
                : "Виберіть вправу для графіка"}
            </Text>
            {chartData.length > 0 && yKeys.length > 0 ? (
              <>
                <View style={styles.chart}>
                  <VictoryChart
                    theme={chartTheme}
                    padding={{ top: 20, bottom: 60, left: 50, right: 20 }}
                    width={340}
                    height={280}
                    defaultAxes={{
                      independent: null,
                      dependent: null,
                    }}
                  >
                    <VictoryAxis
                      tickFormat={xAxisTickFormat}
                      style={{
                        axis: { stroke: "#3C3C43" },
                        tickLabels: { fill: "#1C1C1E", fontSize: 10 },
                        ticks: { stroke: "#3C3C43" },
                        grid: { stroke: "#E5E5EA", strokeDasharray: "4,4" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      style={{
                        axis: { stroke: "#3C3C43" },
                        tickLabels: { fill: "#1C1C1E", fontSize: 10 },
                        ticks: { stroke: "#3C3C43" },
                        grid: { stroke: "#E5E5EA", strokeDasharray: "4,4" },
                      }}
                    />
                    {showWeight && weightLineData.length > 0 && (
                      <VictoryLine
                        data={weightLineData}
                        style={{
                          data: { stroke: "#3B82F6", strokeWidth: 2 },
                        }}
                        interpolation="natural"
                      />
                    )}
                    {showRepetitions && repetitionsLineData.length > 0 && (
                      <VictoryLine
                        data={repetitionsLineData}
                        style={{
                          data: { stroke: "#22C55E", strokeWidth: 2 },
                        }}
                        interpolation="natural"
                      />
                    )}
                  </VictoryChart>
                </View>
                <View style={styles.legend}>
                  {showWeight && (
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#3B82F6" },
                        ]}
                      />
                      <Text style={styles.legendText}>Вага (кг)</Text>
                    </View>
                  )}
                  {showRepetitions && (
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#22C55E" },
                        ]}
                      />
                      <Text style={styles.legendText}>Повторення</Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.chartPlaceholder}>
                <Text style={styles.placeholderText}>
                  Немає даних для відображення. Додайте тренування з цією
                  вправою.
                </Text>
              </View>
            )}
          </View>

          {selectedExercise &&
            showWeight &&
            statistics?.weightRecords === 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Для вправи &quot;{selectedExercise}&quot; немає записів з
                  вагою.
                </Text>
              </View>
            )}
          {selectedExercise &&
            showRepetitions &&
            statistics?.repetitionsRecords === 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Для вправи &quot;{selectedExercise}&quot; немає записів з
                  повтореннями.
                </Text>
              </View>
            )}
          {selectedExercise && !showWeight && !showRepetitions && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Увімкніть вагу або повторення для графіка.
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: "#1C1C1E",
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  toggles: {
    marginBottom: 16,
    gap: 12,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  statsBox: {
    backgroundColor: "#D1D1D6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
    color: "#1C1C1E",
  },
  statsRow: {
    fontSize: 14,
    marginBottom: 4,
    color: "#1C1C1E",
  },
  chartContainer: {
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1C1C1E",
  },
  chart: {
    height: 280,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#1C1C1E",
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    textAlign: "center",
    color: "#3C3C43",
    fontSize: 14,
  },
  warningBox: {
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  warningText: {
    color: "#1C1C1E",
    fontSize: 14,
  },
});
