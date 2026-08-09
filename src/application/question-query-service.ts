import type { FilterState } from '../domain/filter-state';
import type { Question } from '../domain/question';
import type { QuestionRepository } from './question-repository';
import { StudyPathSortStrategy, type QuestionSortStrategy } from './sort-strategy';
import { matchesSearchText } from './text-search';

export class QuestionQueryService {
  private readonly sortStrategy: QuestionSortStrategy;

  constructor(
    private readonly repository: QuestionRepository,
    sortStrategy: QuestionSortStrategy = new StudyPathSortStrategy()
  ) {
    this.sortStrategy = sortStrategy;
  }

  query(state: FilterState): Question[] {
    const query = state.query.trim();
    const matches = this.repository.findAll().filter((question) => (
      (state.difficulty === null || question.difficulty === state.difficulty)
      && (state.group === '' || question.group === state.group)
      && (state.category === '' || question.category === state.category)
      && (state.scope === '' || question.scopes.includes(state.scope))
      && matchesSearchText(searchableText(question), query)
    ));
    return this.sortStrategy.sort(matches);
  }
}

function searchableText(question: Question): string {
  return [
    question.title,
    question.category,
    question.group,
    ...question.scopes,
    question.answer,
    question.source
  ].join(' ');
}
