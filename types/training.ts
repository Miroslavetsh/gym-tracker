export interface Exercise {
  name: string;
  repetitions: number;
  sets: number;
  weight: number;
  perSide: boolean;
}

export type Superset = Exercise[];

export type ExerciseOrSuperset = Exercise | Superset;

export interface CreateTrainingRequest {
  kind: string;
  date: string;
  exercises: ExerciseOrSuperset[];
  accountId: string;
}

export interface Training {
  id: string;
  kind: string;
  date: string;
  createdAt: string;
  updatedAt: string;
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
    createdAt: string;
    updatedAt: string;
  }>;
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
