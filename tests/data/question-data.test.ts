import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Group = 'cpp' | 'gof' | 'ue5';

type AnswerSource = {
  authority: string;
  topic: string;
  locator?: string;
  url?: string;
};

type AuthoringQuestion = {
  id: string;
  group: Group;
  category: string;
  title: string;
  difficulty: number;
  scopes: string[];
  answer: string;
  answerSources: AnswerSource[];
  evidenceIds: string[];
  pattern?: string;
};

type Evidence = {
  id: string;
  company: string;
  role: string;
  sourceTitle: string;
  url: string;
  accessedAt: string;
  reportedQuestion: string;
  publishedAt?: string;
};

const root = resolve(import.meta.dirname, '../../');
const questionFiles: Record<Group, string> = {
  cpp: 'data/questions/cpp.json',
  gof: 'data/questions/gof.json',
  ue5: 'data/questions/ue5.json'
};
const expectedCounts: Record<Group, number> = {
  cpp: 51,
  gof: 20,
  ue5: 40
};
const genericAnswerPadding = /这类(?:规则|问题|知识点)|使用标准库时，关键是|它的价值在于|如果变化点并不存在|不能只看一次调用是否返回成功|工程上应该把/u;
const commonCppAbbreviations = ['ODR', 'ADL', 'PImpl', 'RAII', 'EBO', 'SFINAE', 'NRVO', 'ABI'];
const referenceStyleCppTitlePhrases = /有哪些约束|链接语义|函数候选|表示同一实体|引用限定|对象存储|可移植语义|何时|如何|怎样因为|分别表达什么|分别保证什么|哪些状态|哪些性质|哪些成本|生命周期取舍|二进制边界|适用边界|最终得到什么类型|动态类型|路径表示|可能丢精度的方向|underflow 和 overflow/u;
const commonCppInterviewTitles = new Map([
  ['002', '基类析构函数为什么通常要写成 virtual？']
]);
const allowedAuthorities = new Set([
  'cppreference',
  'iso-cpp',
  'wg21',
  'cpp-core-guidelines',
  'gnu-libstdcxx',
  'gof',
  'epic-games',
  'meta-developers',
  'microsoft-learn',
  'ietf-rfc'
]);
const questionKeys = new Set([
  'id',
  'group',
  'category',
  'title',
  'difficulty',
  'scopes',
  'answer',
  'answerSources',
  'evidenceIds',
  'pattern'
]);
const evidenceKeys = new Set([
  'id',
  'company',
  'role',
  'sourceTitle',
  'url',
  'publishedAt',
  'accessedAt',
  'reportedQuestion'
]);

function loadJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(resolve(root, relativePath), 'utf8')) as T;
}

function normalizeTitle(title: string): string {
  return title
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, '');
}

function sentenceCount(answer: string): number {
  return (answer.match(/[。！？!?]/g) ?? []).length;
}

function hasRepeatedLeadingPhrase(title: string): boolean {
  const words = title.trim().split(/\s+/);
  const maximumLength = Math.min(4, Math.floor(words.length / 2));
  for (let length = 1; length <= maximumLength; length += 1) {
    if (words.slice(0, length).join(' ') === words.slice(length, length * 2).join(' ')) return true;
  }
  return false;
}

function loadQuestions(): AuthoringQuestion[] {
  return (Object.keys(questionFiles) as Group[]).flatMap((group) => {
    const rows = loadJson<AuthoringQuestion[]>(questionFiles[group]);
    return rows.map((row) => ({ ...row, group }));
  });
}

describe('authoring question data', () => {
  const questions = loadQuestions();
  const evidence = loadJson<Evidence[]>('data/evidence/interviews.json');
  const evidenceById = new Map(evidence.map((record) => [record.id, record]));

  it('publishes the requested group counts and one continuous id sequence', () => {
    expect(questions).toHaveLength(111);
    for (const group of Object.keys(expectedCounts) as Group[]) {
      expect(questions.filter((question) => question.group === group)).toHaveLength(expectedCounts[group]);
    }
    const sortedIds = questions.map((question) => question.id)
      .sort((left, right) => Number(left) - Number(right));
    expect(sortedIds).toEqual(
      Array.from({ length: questions.length }, (_, index) => String(index + 1).padStart(3, '0'))
    );
  });

  it('adds a practical UE5 XR and VR interview category backed by Epic topics', () => {
    const xrQuestions = questions.filter((question) => question.category === 'ue5/xr-vr');

    expect(xrQuestions).toHaveLength(5);
    expect(xrQuestions.every((question) => question.group === 'ue5')).toBe(true);
    expect(xrQuestions.every((question) => question.scopes.includes('UE5'))).toBe(true);
    expect(xrQuestions.every((question) => question.answerSources.some((source) => source.authority === 'epic-games'))).toBe(true);
    expect(xrQuestions.every((question) => new Set(question.evidenceIds).size >= 2)).toBe(true);

    const titles = xrQuestions.map((question) => question.title).join('\n');
    expect(titles).toMatch(/OpenXR/);
    expect(titles).toMatch(/XR 输入|Motion Controller|MotionController/);
  });

  it('groups intermediate C++ STL and standard-library questions under a dedicated category', () => {
    const cppQuestions = questions.filter((question) => question.group === 'cpp');
    const cppCategories = cppQuestions.map((question) => question.category);
    const categoryById = new Map(cppQuestions.map((question) => [question.id, question.category]));

    expect(cppCategories).toContain('cpp/stl');
    expect(cppCategories).not.toContain('cpp/stl-containers');
    expect(cppCategories).not.toContain('cpp/containers-iterators');
    for (const id of [
      '008',
      '009',
      '026',
      '027',
      '049'
    ]) {
      expect(categoryById.get(id), id).toBe('cpp/stl');
    }
    const stlTitles = cppQuestions
      .filter((question) => question.category === 'cpp/stl')
      .map((question) => question.title)
      .join('\n');
    expect(stlTitles).not.toMatch(/\bnode_handle\b|allocator 传播/);
  });

  it('keeps the authoring schema strict and keeps URLs out of question cards', () => {
    for (const question of questions) {
      expect(Object.keys(question).every((key) => questionKeys.has(key))).toBe(true);
      expect('refs' in question).toBe(false);
      expect('source' in question).toBe(false);
      expect(JSON.stringify(question)).not.toMatch(/(?:https?|ftp):\/\//i);
      expect(question.answerSources.length).toBeGreaterThan(0);
      for (const source of question.answerSources) {
        expect(allowedAuthorities.has(source.authority)).toBe(true);
        expect(source.topic.trim()).not.toBe('');
        expect(source.locator).toBeUndefined();
        expect(source.url).toBeUndefined();
      }
    }
  });

  it('annotates common C++ abbreviations in the question title', () => {
    for (const question of questions.filter((entry) => entry.group === 'cpp')) {
      if (commonCppAbbreviations.some((abbreviation) => question.title.includes(abbreviation))) {
        expect(question.title, question.id).toMatch(/[（(].*[）)]/);
      }
    }
  });

  it('uses common C++ interview phrasing instead of reference-style titles', () => {
    const cppQuestions = questions.filter((entry) => entry.group === 'cpp');
    const titleById = new Map(cppQuestions.map((question) => [question.id, question.title]));

    for (const [id, title] of commonCppInterviewTitles) {
      expect(titleById.get(id), id).toBe(title);
    }
    for (const question of cppQuestions) {
      expect(question.title, question.id).not.toMatch(referenceStyleCppTitlePhrases);
    }
  });

  it('rejects duplicate titles, normalized questions, and generated suffix templates', () => {
    const titles = questions.map((question) => question.title.trim());
    expect(new Set(titles).size).toBe(titles.length);
    const normalized = questions.map((question) => normalizeTitle(question.title));
    expect(new Set(normalized).size).toBe(normalized.length);

    const suffixes = questions.map((question) => question.title.split('：').slice(1).join('：'));
    const repeatedSuffixes = suffixes.filter((suffix, index) => suffix !== '' && suffixes.indexOf(suffix) !== index);
    expect(repeatedSuffixes).toHaveLength(0);
  });

  it('requires complete spoken answers, real difficulty, and version-appropriate scopes', () => {
    for (const question of questions) {
      expect(question.difficulty).toBeGreaterThanOrEqual(1);
      expect(question.difficulty).toBeLessThanOrEqual(5);
      expect(sentenceCount(question.answer)).toBeGreaterThanOrEqual(2);
      expect(sentenceCount(question.answer)).toBeLessThanOrEqual(5);
      expect(question.scopes.length).toBeGreaterThan(0);
      if (question.group === 'cpp' || question.group === 'gof') {
        expect(question.scopes.every((scope) => ['C++11', 'C++14', 'C++17'].includes(scope))).toBe(true);
        expect(question.title).not.toMatch(/\b(?:constinit|consteval|concepts?|requires|co_await|jthread|std::span|std::format)\b/i);
      } else if (question.group === 'ue5') {
        expect(question.scopes).toContain('UE5');
      }
    }
  });

  it('keeps spoken answers free of generic padding sentences', () => {
    for (const question of questions) {
      expect(question.answer, question.id).not.toMatch(genericAnswerPadding);
    }
  });

  it('links every question to two distinct interview records with named company and role', () => {
    expect(evidence.length).toBeGreaterThan(1);
    for (const record of evidence) {
      expect(Object.keys(record).every((key) => evidenceKeys.has(key))).toBe(true);
      expect(record.company.trim()).not.toBe('');
      expect(record.role.trim()).not.toBe('');
      expect(record.url).toMatch(/^https?:\/\//i);
      expect(record.reportedQuestion.trim()).not.toBe('');
    }
    for (const question of questions) {
      expect(new Set(question.evidenceIds).size).toBeGreaterThanOrEqual(2);
      const records = question.evidenceIds
        .map((id) => evidenceById.get(id))
        .filter((record): record is Evidence => record !== undefined);
      expect(records).toHaveLength(question.evidenceIds.length);
      expect(records.some((record) => record.company.trim() !== '' && record.role.trim() !== '')).toBe(true);
    }
  });

  it('does not reuse the same answer for different normalized questions', () => {
    const answerMap = new Map<string, string>();
    for (const question of questions) {
      const normalizedAnswer = question.answer.normalize('NFKC').replace(/\s+/g, '');
      const previous = answerMap.get(normalizedAnswer);
      expect(previous, `duplicate answer for ${question.id} and ${previous ?? 'unknown'}`).toBeUndefined();
      answerMap.set(normalizedAnswer, question.id);
    }
  });

  it('keeps C++ questions free of generated prompts and answer-coaching language', () => {
    const cppQuestions = questions.filter((question) => question.group === 'cpp');
    const generatedPrompt = /在编译、链接和运行时分别由哪些规则决定|放在头文件并跨翻译单元使用时|它与最接近的语言特性边界在哪里|面试中常见误区是什么/;
    const answerCoaching = /回答中应|先说明|应覆盖|成功路径|失败路径|给出一个.*例子|最小复现方式|调用方、库和运行时分别承担/;

    for (const question of cppQuestions) {
      expect(question.title, question.id).not.toMatch(generatedPrompt);
      expect(question.answer, question.id).not.toMatch(answerCoaching);
      expect(question.answer.trim(), question.id).not.toContain(question.title.replace(/[？?]$/, ''));
      for (const source of question.answerSources) {
        expect(source.topic, question.id).not.toMatch(/^(?:C\+\+|language|standard library|general)$/i);
      }
    }
  });

  it('keeps GoF answers independent, pattern-specific, and free of coaching language', () => {
    const gofQuestions = questions.filter((question) => question.group === 'gof');
    const creationPatterns = new Set(['Abstract Factory', 'Builder', 'Factory Method', 'Prototype', 'Singleton']);
    const structuralPatterns = new Set(['Adapter', 'Bridge', 'Composite', 'Decorator', 'Facade', 'Flyweight', 'Proxy']);
    const behavioralPatterns = new Set([
      'Chain of Responsibility',
      'Command',
      'Interpreter',
      'Iterator',
      'Mediator',
      'Memento',
      'Observer',
      'State',
      'Strategy',
      'Template Method',
      'Visitor'
    ]);
    const allowedPatterns = new Set([...creationPatterns, ...structuralPatterns, ...behavioralPatterns, 'Cross-pattern']);
    const forbidden = /先说明|回答中应|成功路径|失败路径|资源或状态的建立|观察和清理|给出(?:一个)?例子|最小复现/;

    for (const question of gofQuestions) {
      expect(question.pattern, question.id).toBeTruthy();
      expect(allowedPatterns.has(question.pattern ?? ''), question.id).toBe(true);
      if (question.pattern && creationPatterns.has(question.pattern)) {
        expect(question.category, question.id).toBe('gof/creation');
      } else if (question.pattern && structuralPatterns.has(question.pattern)) {
        expect(question.category, question.id).toBe('gof/structural');
      } else if (question.pattern && behavioralPatterns.has(question.pattern)) {
        expect(question.category, question.id).toBe('gof/behavioral');
      }
      expect(question.answer, question.id).not.toMatch(forbidden);
      expect(question.answer.trim(), question.id).not.toContain(question.title.replace(/[？?!]$/, ''));
      expect(question.answerSources.some((source) => source.authority === 'gof'), question.id).toBe(true);
      expect(question.answerSources.every((source) => !/^(?:GoF|pattern|general|design patterns?)$/i.test(source.topic.trim())), question.id).toBe(true);
    }
  });

  it('keeps UE5 answers free of generated coaching language', () => {
    const ue5Questions = questions.filter((question) => question.group === 'ue5');
    const forbidden = /先说明|先区分|先按|先确定|先界定|回答中应|成功路径|失败路径|资源或状态的建立|调用方必须承担|观察和清理|给出(?:一个)?例子|最小复现/;

    for (const question of ue5Questions) {
      expect(question.answer, question.id).not.toMatch(forbidden);
      expect(question.answer.trim(), question.id).not.toContain(question.title.replace(/[？?!]$/, ''));
      expect(question.answerSources.every((source) => source.topic.trim() !== ''), question.id).toBe(true);
      expect(question.answerSources.some((source) => source.authority === 'epic-games'), question.id).toBe(true);
      expect(question.answerSources.every((source) => !/^(?:UE5|Unreal|general)$/i.test(source.topic.trim())), question.id).toBe(true);
    }
  });

  it('keeps UE5 titles free of repeated topic prefixes', () => {
    const ue5Questions = questions.filter((question) => question.group === 'ue5');
    const mechanicalTopicLabel = /^(?:UObject 反射信息|UHT 头文件解析|属性编辑器权限|Outer 层级|对象标志|GC 可达性|Actor 构造函数|组件注册|根组件层级|运行时 CreateComponent|组件 Tick 依赖|Subsystem 初始化|组件模板|Actor 销毁回调|接口指针转换|线程池任务|异步加载回调|取消异步任务|Actor 复制开关|条件复制|服务器权威|组件复制|子对象复制|FArchive 序列化|SaveGame 字段|USaveGame 版本|重连恢复|Build\.cs 公有依赖|Build\.cs 私有依赖|UHT 模块依赖|第三方库接入|模块 API 宏)\s+/;

    for (const question of ue5Questions) {
      expect(hasRepeatedLeadingPhrase(question.title), question.id).toBe(false);
      expect(question.title, question.id).not.toMatch(mechanicalTopicLabel);
    }
  });
});
