export interface ExerciseDto {
  name: string;
  repetitions: number;
  sets: number;
  weight: number;
  perSide: boolean;
}

export interface Exercise extends ExerciseDto {
  id: string;
}

export type Superset = Exercise[];
export type SupersetDto = ExerciseDto[];

export type ExerciseOrSuperset = Exercise | Superset;
export type ExerciseOrSupersetDto = ExerciseDto | SupersetDto;

export interface CreateTrainingRequest {
  kind: string;
  date: string;
  exercises: ExerciseOrSupersetDto[];
  accountId: string;
}

export interface Training {
  id: string;
  kind: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  exercises?: Array<Exercise>;
}

export interface PaginationInfo {
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
}

export interface TrainingsResponse {
  trainings: Training[];
  totalCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
}
