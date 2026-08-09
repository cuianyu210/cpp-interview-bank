type TechnicalTerm = {
  readonly term: string;
  readonly expansion: string;
};

const technicalTerms: readonly TechnicalTerm[] = [
  { term: 'ABI', expansion: 'Application Binary Interface（应用二进制接口）' },
  { term: 'ADL', expansion: 'Argument-Dependent Lookup（实参依赖查找）' },
  { term: 'API', expansion: 'Application Programming Interface（应用程序接口）' },
  { term: 'DLL', expansion: 'Dynamic-Link Library（动态链接库）' },
  { term: 'GC', expansion: 'Garbage Collection（垃圾回收）' },
  { term: 'IOCP', expansion: 'I/O Completion Port（I/O 完成端口）' },
  { term: 'NRVO', expansion: 'Named Return Value Optimization（具名返回值优化）' },
  { term: 'OOP', expansion: 'Object-Oriented Programming（面向对象编程）' },
  { term: 'ODR', expansion: 'One Definition Rule（单一定义规则）' },
  { term: 'RAII', expansion: 'Resource Acquisition Is Initialization（资源获取即初始化）' },
  { term: 'RPC', expansion: 'Remote Procedure Call（远程过程调用）' },
  { term: 'RTTI', expansion: 'Run-Time Type Information（运行时类型信息）' },
  { term: 'SFINAE', expansion: 'Substitution Failure Is Not An Error（替换失败不是错误）' },
  { term: 'SSO', expansion: 'Small String Optimization（小字符串优化）' },
  { term: 'STL', expansion: 'Standard Template Library（标准模板库）' },
  { term: 'UTF', expansion: 'Unicode Transformation Format（Unicode 转换格式）' }
];

export function buildTechnicalTermNotes(title: string): string[] {
  return technicalTerms
    .map((entry) => ({ entry, index: title.indexOf(entry.term) }))
    .filter(({ index }) => index >= 0)
    .sort((left, right) => left.index - right.index || right.entry.term.length - left.entry.term.length)
    .map(({ entry }) => `${entry.term} = ${entry.expansion}`);
}
