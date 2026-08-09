import type { Question } from '../domain/question';
import { QuestionCardView } from './question-card-view';

export class QuestionListView {
  private readonly list: HTMLElement;
  private readonly count: HTMLElement;
  private readonly empty: HTMLElement;
  private questions: readonly Question[] = [];
  private rendered = 0;

  constructor(
    document: Document,
    private readonly batchSize = 30,
    private readonly cards = new QuestionCardView(document)
  ) {
    this.list = required(document, 'question-list');
    this.count = required(document, 'result-count');
    this.empty = required(document, 'empty-state');
  }

  render(questions: readonly Question[]): void {
    this.questions = [...questions];
    this.rendered = 0;
    this.list.textContent = '';
    this.count.textContent = `${this.questions.length} 道题`;
    this.empty.hidden = this.questions.length > 0;
    this.renderMore();
  }

  renderMore(): boolean {
    if (this.rendered >= this.questions.length) return false;
    const end = Math.min(this.rendered + this.batchSize, this.questions.length);
    const fragment = this.list.ownerDocument.createDocumentFragment();
    for (let index = this.rendered; index < end; index += 1) {
      fragment.append(this.cards.render(this.questions[index]));
    }
    this.list.append(fragment);
    this.rendered = end;
    return true;
  }

  get hasMore(): boolean {
    return this.rendered < this.questions.length;
  }
}

function required(document: Document, id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing presentation element: #${id}`);
  return element;
}
