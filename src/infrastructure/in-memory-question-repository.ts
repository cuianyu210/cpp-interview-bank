import type { QuestionRepository } from '../application/question-repository';
import type { Question } from '../domain/question';

export class InMemoryQuestionRepository implements QuestionRepository {
  private readonly questions: readonly Question[];

  constructor(questions: readonly Question[]) {
    this.questions = Object.freeze([...questions]);
  }

  findAll(): readonly Question[] {
    return [...this.questions];
  }

  findById(id: string): Question | undefined {
    return this.questions.find((question) => question.id === id);
  }
}
