import type {
  AnswerAuthority,
  AuthoringQuestion,
  QuestionGroup
} from '../../src/domain/question';

const answerAuthorities: Record<QuestionGroup, ReadonlySet<AnswerAuthority>> = {
  cpp: new Set(['cppreference', 'iso-cpp', 'wg21', 'cpp-core-guidelines', 'gnu-libstdcxx']),
  gof: new Set(['gof']),
  ue5: new Set(['epic-games']),
  windows: new Set(['microsoft-learn', 'ietf-rfc'])
};

const generatedPrompt = /在编译、链接和运行时分别由哪些规则决定|放在头文件并跨翻译单元使用时|与最接近的.*边界在哪里|面试中常见误区是什么/;
const coachingAnswer = /回答中应|成功路径|失败路径|调用方必须承担|给出(?:一个)?例子|最小复现|先(?:说明|区分|界定|确定|按)/;
const genericAnswerPadding = /这类(?:规则|问题|知识点)|使用标准库时，关键是|它的价值在于|如果变化点并不存在|不能只看一次调用是否返回成功|工程上应该把/u;
const sentenceEnding = /[。！？!?]/g;

export function checkQuestionContent(question: AuthoringQuestion): string[] {
  return [
    ...sourceErrors(question),
    idError(question),
    patternError(question),
    phrasingError(question),
    genericPaddingError(question),
    sentenceCountError(question),
    categoryError(question)
  ].filter((error): error is string => Boolean(error));
}

function sourceErrors(question: AuthoringQuestion): string[] {
  const errors: string[] = [];
  const allowed = answerAuthorities[question.group];
  if (question.answerSources.some((source) => source.url || source.locator)) {
    errors.push(`${question.id}: answer source URLs and locators are not allowed`);
  }
  question.answerSources.forEach((source) => {
    if (!allowed.has(source.authority)) {
      errors.push(
        `${question.id}: ${source.authority} is not an authoritative answer source for ${question.group}`
      );
    }
  });
  return errors;
}

function idError(question: AuthoringQuestion): string | undefined {
  return /^\d{3,}$/.test(question.id)
    ? undefined
    : `${question.id}: question id must contain at least three digits`;
}

function patternError(question: AuthoringQuestion): string | undefined {
  if (question.group === 'gof') {
    return question.pattern ? undefined : `${question.id}: GoF questions require a pattern`;
  }
  return question.pattern ? `${question.id}: pattern is only allowed for GoF questions` : undefined;
}

function phrasingError(question: AuthoringQuestion): string | undefined {
  return generatedPrompt.test(question.title) || coachingAnswer.test(question.answer)
    ? `${question.id}: generated or coaching phrasing is not allowed`
    : undefined;
}

function sentenceCountError(question: AuthoringQuestion): string | undefined {
  const sentences = (question.answer.match(sentenceEnding) ?? []).length;
  return sentences >= 2 && sentences <= 5
    ? undefined
    : `${question.id}: answer must contain between two and five sentences`;
}

function genericPaddingError(question: AuthoringQuestion): string | undefined {
  return genericAnswerPadding.test(question.answer)
    ? `${question.id}: generic answer padding is not allowed`
    : undefined;
}

function categoryError(question: AuthoringQuestion): string | undefined {
  return question.category.startsWith(`${question.group}/`)
    ? undefined
    : `${question.id}: category must belong to ${question.group}`;
}
