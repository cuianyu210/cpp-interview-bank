import { describe, expect, it } from 'vitest';
import type { Question } from '../../src/domain/question';
import { QuestionCardView } from '../../src/presentation/question-card-view';

describe('QuestionCardView', () => {
  it('renders study content without company, evidence, or URL metadata', () => {
    const question = {
      id: '007',
      group: 'cpp',
      category: 'cpp/lifetime-raii',
      title: 'RAII in C++',
      difficulty: 2,
      scopes: ['C++11', 'C++17'],
      answer: 'Acquire resources in constructors and release them in destructors.',
      source: 'cppreference: RAII',
      company: 'Hidden Company',
      evidenceIds: ['hidden-evidence'],
      url: 'https://example.test/private'
    } as Question & Record<string, unknown>;

    const card = new QuestionCardView(document).render(question);
    const text = card.textContent ?? '';

    expect(text).toContain('#007');
    expect(text).toContain(question.title);
    expect(card.querySelector('.difficulty-badge')).not.toBeNull();
    expect(text).toContain('C++11');
    expect(text).toContain('口述简答');
    expect(text).toContain(question.answer);
    expect(text).toContain(question.source);
    expect(text).not.toContain('Hidden Company');
    expect(text).not.toContain('hidden-evidence');
    expect(text).not.toContain('https://');
  });

  it('adds acronym notes for known abbreviations in the title', () => {
    const question: Question = {
      id: '008',
      group: 'cpp',
      category: 'cpp/core-language',
      title: 'ODR and RAII in one translation unit',
      difficulty: 3,
      scopes: ['C++17'],
      answer: 'Answer.',
      source: 'cppreference'
    };

    const card = new QuestionCardView(document).render(question);
    const glossary = card.querySelector('.question-glossary');

    expect(glossary?.textContent).toContain('ODR = One Definition Rule');
    expect(glossary?.textContent).toContain('RAII = Resource Acquisition Is Initialization');
  });
});
