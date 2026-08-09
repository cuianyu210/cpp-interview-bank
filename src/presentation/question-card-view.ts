import { Difficulty } from '../domain/difficulty';
import type { Question } from '../domain/question';
import { buildTechnicalTermNotes } from './question-acronym-glossary';

export class QuestionCardView {
  constructor(private readonly document: Document) {}

  render(question: Question): HTMLElement {
    const article = this.element('article', 'question');
    article.id = `q-${question.id}`;

    const heading = this.element('div', 'question-top');
    heading.append(
      this.text('span', `#${question.id}`, 'question-id'),
      this.text('h2', question.title)
    );

    const badges = this.element('div', 'badges');
    const difficulty = this.text(
      'span',
      Difficulty.from(question.difficulty).stars,
      'badge difficulty-badge'
    );
    difficulty.setAttribute('aria-label', `难度 ${question.difficulty} / 5`);
    badges.append(difficulty);
    question.scopes.forEach((scope) => badges.append(this.text('span', scope, 'badge')));

    const glossaryNotes = buildTechnicalTermNotes(question.title);
    const glossary = glossaryNotes.length > 0
      ? this.text('p', `术语注解：${glossaryNotes.join('；')}`, 'question-glossary')
      : null;

    const answer = this.element('section', 'answer');
    answer.append(
      this.text('h3', '口述简答'),
      this.text('p', question.answer)
    );
    const source = this.text('p', question.source, 'answer-source');

    article.append(heading);
    if (glossary) article.append(glossary);
    article.append(badges, answer, source);
    return article;
  }

  private element<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className = ''
  ): HTMLElementTagNameMap[K] {
    const element = this.document.createElement(tag);
    element.className = className;
    return element;
  }

  private text<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    value: string,
    className = ''
  ): HTMLElementTagNameMap[K] {
    const element = this.element(tag, className);
    element.textContent = value;
    return element;
  }
}
