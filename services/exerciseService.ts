import { ApiService } from "./api";

export interface Exercise {
  id: string;
  name: string;
  type?: string;
}

export class ExerciseService {
  static async getAll(): Promise<Exercise[]> {
    return ApiService.get<Exercise[]>("/exercises");
  }

  static async getAllUniq(): Promise<Exercise[]> {
    return ApiService.get<Exercise[]>("/exercises?uniq=true");
  }
}
