import {
  CreateTrainingRequest,
  Training,
  TrainingsResponse,
} from "../types/training";
import { ApiService } from "./api";

export class TrainingService {
  static async getAllTrainings(): Promise<Training[]> {
    return ApiService.get<Training[]>("/trainings");
  }

  static async getPaginatedTrainings(
    limit: number = 10,
    offset: number = 0
  ): Promise<TrainingsResponse> {
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    }).toString();
    return ApiService.get<TrainingsResponse>(`/trainings?${searchParams}`);
  }

  static async createTraining(data: CreateTrainingRequest): Promise<Training> {
    return ApiService.post<Training>("/trainings", {
      ...data,
      kind: data.kind.toLowerCase(),
    });
  }

  static async deleteTraining(trainingId: string): Promise<void> {
    return ApiService.delete<void>(`/trainings/${trainingId}`);
  }
}
