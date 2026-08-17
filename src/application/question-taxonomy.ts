import type { Question, QuestionGroup } from '../domain/question';

export const studyPathGroupOrder: readonly QuestionGroup[] = ['cpp', 'gof', 'ue5'];

export const studyPathGroupLabels: Readonly<Record<QuestionGroup, string>> = {
  cpp: '标准 C++',
  gof: 'GoF 设计模式',
  ue5: 'UE5 C++'
};

export const studyPathCategoryLabels: Readonly<Record<string, string>> = {
  'cpp/core-language': '核心语言',
  'cpp/types-expressions-initialization': '类型、表达式与初始化',
  'cpp/classes-object-model': '类与对象模型',
  'cpp/lifetime-raii': '生命周期与 RAII',
  'cpp/value-categories-move-forwarding': '值类别、移动与完美转发',
  'cpp/smart-pointers-allocators': '智能指针与内存分配',
  'cpp/stl': 'STL/标准库',
  'cpp/strings-time-files-streams': '字符串、时间、文件与流',
  'cpp/lambdas-utility-types': 'Lambda 与工具类型',
  'cpp/templates-sfinae-traits-constexpr': '模板、SFINAE、类型萃取与 constexpr',
  'cpp/exceptions-rtti': '异常与 RTTI',
  'cpp/standard-concurrency': '标准并发',
  'cpp/algorithms': '数组、链表与树',
  'gof/creation': '创建型模式',
  'gof/structural': '结构型模式',
  'gof/behavioral': '行为型模式',
  'ue5/uobject-reflection-gc': 'UObject、反射与垃圾回收',
  'ue5/actor-component-subsystem': 'Actor、Component 与 Subsystem',
  'ue5/delegate-interface-async': '委托、接口与异步',
  'ue5/replication-rpc-serialization': '复制、RPC 与序列化',
  'ue5/modules-plugins-buildcs': '模块、插件与 Build.cs',
  'ue5/xr-vr': 'XR/VR 交互与性能'
};

const categoryOrderByGroup: Readonly<Record<QuestionGroup, readonly string[]>> = {
  cpp: [
    'cpp/core-language',
    'cpp/types-expressions-initialization',
    'cpp/classes-object-model',
    'cpp/lifetime-raii',
    'cpp/value-categories-move-forwarding',
    'cpp/smart-pointers-allocators',
    'cpp/stl',
    'cpp/strings-time-files-streams',
    'cpp/lambdas-utility-types',
    'cpp/templates-sfinae-traits-constexpr',
    'cpp/exceptions-rtti',
    'cpp/standard-concurrency',
    'cpp/algorithms'
  ],
  gof: ['gof/creation', 'gof/structural', 'gof/behavioral'],
  ue5: [
    'ue5/uobject-reflection-gc',
    'ue5/actor-component-subsystem',
    'ue5/delegate-interface-async',
    'ue5/replication-rpc-serialization',
    'ue5/modules-plugins-buildcs',
    'ue5/xr-vr'
  ]
};

const groupIndexByOrder = new Map(studyPathGroupOrder.map((group, index) => [group, index]));
const categoryIndexByGroup = new Map(
  (Object.entries(categoryOrderByGroup) as Array<[QuestionGroup, readonly string[]]>).map(
    ([group, categories]) => [group, new Map(categories.map((category, index) => [category, index]))]
  )
);

export function compareQuestionsByStudyPath(left: Question, right: Question): number {
  return compareGroup(left.group, right.group)
    || compareCategory(left.group, left.category, right.category)
    || left.difficulty - right.difficulty
    || numericId(left.id) - numericId(right.id)
    || compareText(left.id, right.id);
}

export function compareCategoriesByStudyPath(group: QuestionGroup, left: string, right: string): number {
  return compareCategory(group, left, right);
}

export function sortCategoriesByStudyPath(group: QuestionGroup, categories: readonly string[]): string[] {
  return [...categories].sort((left, right) => compareCategory(group, left, right));
}

export function categoryLabel(category: string): string {
  const label = studyPathCategoryLabels[category];
  if (label) return label;
  const name = category.split('/').pop() ?? category;
  return name.replace(/-/g, ' / ');
}

function compareGroup(left: QuestionGroup, right: QuestionGroup): number {
  return groupIndex(left) - groupIndex(right) || compareText(left, right);
}

function compareCategory(group: QuestionGroup, left: string, right: string): number {
  if (left === right) return 0;
  const order = categoryIndexByGroup.get(group);
  if (order) {
    const leftIndex = order.get(left);
    const rightIndex = order.get(right);
    const leftKnown = leftIndex !== undefined;
    const rightKnown = rightIndex !== undefined;
    if (leftKnown || rightKnown) {
      if (leftKnown && rightKnown) return leftIndex - rightIndex;
      return leftKnown ? -1 : 1;
    }
  }
  return compareText(left, right);
}

function groupIndex(group: QuestionGroup): number {
  return groupIndexByOrder.get(group) ?? Number.POSITIVE_INFINITY;
}

function numericId(id: string): number {
  const match = /(\d+)$/.exec(id);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
