# 名企高频面试题库 OOP/TDD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有模板化静态题库重构为可离线运行、证据可审计、按难度排序的 TypeScript OOP 应用，并提交可直接打开的构建产物。

**Architecture:** Domain 定义不可变题目、难度和筛选状态；Application 通过 Repository、排序 Strategy 和 Observer 状态存储提供用例；Infrastructure 负责 JSON 题库、Hash 和浏览器边界；Presentation 只负责渲染，Controller 协调用例和视图。Bootstrap 组装依赖，避免全局单例和 DOM 业务逻辑。

**Tech Stack:** TypeScript strict, pnpm, Vitest/jsdom, ESLint, esbuild, Playwright。

---

### Task 1: 基础工具链与领域契约

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`
- Create: `src/domain/*`, `tests/domain/*`

- [ ] 写领域类型和不可变值对象测试。
- [ ] 运行测试确认缺少实现时按预期失败。
- [ ] 实现 `Question`、`Difficulty`、`FilterState` 和证据/来源类型。
- [ ] 运行类型检查、单测并重构到每文件 200 行以内。

### Task 2: 查询、状态和维护命令

**Files:**
- Create: `src/application/*`, `src/infrastructure/*`, `tools/questions/*`, `tests/application/*`, `tests/infrastructure/*`, `tests/cli/*`

- [ ] 先为搜索、筛选、难度优先排序、Observer 通知、Hash 恢复和批量更新写失败测试。
- [ ] 实现 Repository、Strategy、状态用例、Hash/浏览器 Adapter 和原子化 CLI。
- [ ] `search`、`evidence`、`stats`、`apply`、`build`、`check` 全部走同一验证管线。

### Task 3: 页面分层与静态构建

**Files:**
- Create: `src/presentation/*`, `src/controller/*`, `src/app.ts`, `src/styles/main.css`, `tests/presentation/*`, `tests/controller/*`
- Modify: `index.html`
- Generate: `app.js`, `styles.css`

- [ ] 用 jsdom 先验证卡片、筛选栏、分类导航、增量渲染和移动抽屉的用户可见行为。
- [ ] 实现视图与 Controller，保证 DOM 不承载业务规则。
- [ ] 用 esbuild 生成 IIFE `app.js` 和离线 `styles.css`。

### Task 4: 题库与证据迁移

**Files:**
- Create: `data/questions/*.json`, `data/evidence/interviews.json`, `data/sources/*.json`
- Create: `tests/data/*`
- Delete/retire: `tools/refresh_titles.ps1`, `tools/populate_answers.ps1`

- [ ] 只保留有两条独立面经证据且至少一条关联企业/岗位的题目。
- [ ] 标准 C++ 精选 150 道；GoF/UE5/Windows 在证据不足时发布较少数量。
- [ ] 题干去模板、答案 2-5 句、来源限定权威机构；浏览器数据不得含企业证据 URL。
- [ ] 数据测试拒绝重复题目/答案、非法星级、错误版本、URL 泄漏和来源不足。

### Task 5: 文档、CI 与验收

**Files:**
- Create: `AGENTS.md`, `.github/workflows/ci.yml`
- Modify: `README.md`, `.github/workflows/pages.yml`

- [ ] 添加维护命令和数据边界说明，禁止直接编辑生成文件。
- [ ] CI 执行 typecheck、lint、coverage、题库 check、构建一致性和 Playwright。
- [ ] 通过 `file://` 桌面/移动端验证搜索、筛选、排序、Hash 恢复和零外部请求。

### Final review

- [ ] 运行完整验证命令并阅读退出码、失败数和覆盖率。
- [ ] 完成规格审查和代码质量审查，修复所有重要问题。
- [ ] 生成题目总数、证据覆盖率、公司/分类/星级和来源分布报告。
