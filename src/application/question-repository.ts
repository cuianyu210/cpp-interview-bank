import type { Question } from '../domain/question';

export interface QuestionRepository {
  findAll(): readonly Question[];
  findById(id: string): Question | undefined;
}
