import { Exercise } from "@/types/training";
import { ApiService } from "./api";

export class ExerciseService {
  static async getAll(): Promise<Exercise[]> {
    return ApiService.get<Exercise[]>("/exercises");
  }

  static async getAllUniq(): Promise<Exercise[]> {
    return ApiService.get<Exercise[]>("/exercises?uniq=true");
  }
}
