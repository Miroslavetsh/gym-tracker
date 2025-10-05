import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TrainingService } from '@/services/trainingService';
import { Training } from '@/types/training';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const data = await TrainingService.getAllTrainings();
      setTrainings(data);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося завантажити тренування');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = async (trainingId: string) => {
    Alert.alert(
      'Видалити тренування',
      'Ви впевнені, що хочете видалити це тренування?',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await TrainingService.deleteTraining(trainingId);
              setTrainings(prev => prev.filter(t => t.id !== trainingId));
            } catch (error) {
              Alert.alert('Помилка', 'Не вдалося видалити тренування');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const renderTraining = ({ item }: { item: Training }) => (
    <Card style={styles.trainingCard}>
      <View style={styles.trainingHeader}>
        <Text style={styles.trainingKind}>{item.kind}</Text>
        <Text style={styles.trainingDate}>
          {new Date(item.date).toLocaleDateString('uk-UA')}
        </Text>
      </View>
      
      {item.exercises && item.exercises.length > 0 && (
        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Вправи:</Text>
          {item.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.sets} × {exercise.repetitions}
                {exercise.weight && ` @ ${exercise.weight}кг`}
                {exercise.perSide && ' (на сторону)'}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.trainingActions}>
        <Button
          title="Видалити"
          variant="danger"
          onPress={() => handleDeleteTraining(item.id)}
          style={styles.deleteButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мої тренування</Text>
        <Button
          title="Оновити"
          onPress={fetchTrainings}
          disabled={loading}
        />
      </View>
      
      <FlatList
        data={trainings}
        renderItem={renderTraining}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchTrainings}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Немає тренувань</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  listContainer: {
    padding: 16,
  },
  trainingCard: {
    marginBottom: 16,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainingKind: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  trainingDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  exercisesContainer: {
    marginBottom: 12,
  },
  exercisesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  exerciseItem: {
    marginLeft: 8,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  trainingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
  },
});