import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Collapsible } from "@/components/ui/collapsible";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

interface Training {
  id: string;
  kind: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  exercises?: Array<{
    id: string;
    trainingId: string | null;
    supersetId: string | null;
    name: string;
    repetitions: number;
    sets: number;
    perSide: boolean;
    weight: number | null;
    rawWeight: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const getApiUrl = () => "https://technolifestore.com/api/sport/trainings";

export default function GymTrackerScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTrainings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trainings"
      );
      console.error("Error fetching trainings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Gym Tracker
        </ThemedText>
      </ThemedView>
      <Collapsible title="Gym Tracker Usage">
        <ThemedText>
          You can use the Gym Tracker to track your gym workouts. Please connect
          the device using bluetooth and start the workout.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Fetch All Trainings">
        <ThemedText style={styles.debugText}>
          Platform: {Platform.OS}
        </ThemedText>

        {loading && (
          <ThemedText style={styles.loadingText}>
            Loading trainings...
          </ThemedText>
        )}

        {error && (
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        )}

        {!loading && !error && trainings.length === 0 && (
          <ThemedText>No trainings found.</ThemedText>
        )}

        {!loading && !error && trainings.length > 0 && (
          <ThemedView style={styles.trainingsContainer}>
            <ThemedText style={styles.trainingsTitle}>
              Found {trainings.length} training(s):
            </ThemedText>
            {trainings.map((training) => (
              <ThemedView key={training.id} style={styles.trainingCard}>
                <ThemedText style={styles.trainingName}>
                  {training.kind}
                </ThemedText>
                <ThemedText style={styles.trainingDate}>
                  Date: {new Date(training.date).toLocaleDateString()}
                </ThemedText>
                {training.exercises && training.exercises.length > 0 && (
                  <ThemedText style={styles.trainingDuration}>
                    Exercises: {training.exercises.length}
                  </ThemedText>
                )}
                {training.exercises && training.exercises.length > 0 && (
                  <ThemedView style={styles.exercisesContainer}>
                    <ThemedText style={styles.exercisesTitle}>
                      Exercises:
                    </ThemedText>
                    {training.exercises.map((exercise, index) => (
                      <ThemedView key={index} style={styles.exerciseItem}>
                        <ThemedText style={styles.exerciseName}>
                          {exercise.name}
                        </ThemedText>
                        <ThemedText style={styles.exerciseDetails}>
                          {exercise.sets} sets × {exercise.repetitions} reps
                          {exercise.weight && ` @ ${exercise.weight}kg`}
                        </ThemedText>
                      </ThemedView>
                    ))}
                  </ThemedView>
                )}
              </ThemedView>
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.buttonContainer}>
          <ThemedText style={styles.refreshButton} onPress={fetchTrainings}>
            🔄 Refresh Trainings
          </ThemedText>
        </ThemedView>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  debugText: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 10,
    fontFamily: "monospace",
  },
  loadingText: {
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  errorText: {
    color: "#ff4444",
    textAlign: "center",
    marginVertical: 10,
  },
  trainingsContainer: {
    marginTop: 10,
  },
  trainingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trainingCard: {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.3)",
  },
  trainingName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trainingDate: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  trainingDuration: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  exercisesContainer: {
    marginTop: 8,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  exerciseItem: {
    marginLeft: 10,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "500",
  },
  exerciseDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
