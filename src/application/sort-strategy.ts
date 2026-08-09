import type { Question } from '../domain/question';
import { compareQuestionsByStudyPath } from './question-taxonomy';

export interface QuestionSortStrategy {
  sort(questions: readonly Question[]): Question[];
}

export class StudyPathSortStrategy implements QuestionSortStrategy {
  sort(questions: readonly Question[]): Question[] {
    return [...questions].sort(compareQuestionsByStudyPath);
  }
}
