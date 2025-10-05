import { CreateTrainingRequest, Training } from "../types/training";
import { ApiService } from "./api";

export class TrainingService {
  static async getAllTrainings(): Promise<Training[]> {
    return ApiService.get<Training[]>("/trainings");
  }

  static async getLast10Trainings(): Promise<Training[]> {
    return ApiService.get<Training[]>("/trainings?limit=10");
  }

  static async createTraining(data: CreateTrainingRequest): Promise<Training> {
    return ApiService.post<Training>("/trainings", data);
  }

  static async deleteTraining(trainingId: string): Promise<void> {
    return ApiService.delete<void>(`/trainings/${trainingId}`);
  }
}
