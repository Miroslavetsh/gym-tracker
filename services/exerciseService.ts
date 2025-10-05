import { ApiService } from './api';

export interface Exercise {
  id: string;
  name: string;
  type?: string;
}

export class ExerciseService {
  static async getAllExercises(): Promise<Exercise[]> {
    return ApiService.get<Exercise[]>('/exercises');
  }
}
