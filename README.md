# C++ 与工程面试题库

这是一个可直接通过 `file://` 打开的离线面试题库，覆盖标准 C++、GoF 设计模式、UE5 C++ 和 Windows 用户态系统与网络。页面只加载仓库根目录的 `index.html`、`styles.css`、`app.js` 与 `questions.js`，不依赖外部服务。

## 直接使用

双击 `index.html` 即可打开。页面支持关键词搜索、标准范围和难度筛选、分类导航、Hash 状态恢复以及移动端抽屉。

浏览器公开数据只包含题目、口述简答和弱来源文字，不包含公司归属、面经证据或外部 URL。

## 本地维护

需要 Node.js 22 与 pnpm 11。首次使用先安装依赖：

```powershell
pnpm install --frozen-lockfile
```

常用维护命令：

```powershell
pnpm questions search --query RAII
pnpm questions search --group ue5 --category ue5/uobject-reflection-gc
pnpm questions evidence --id 001
pnpm questions stats
pnpm questions apply --file changes.json --dry-run
pnpm questions apply --file changes.json
pnpm questions build
pnpm questions check
```

`apply` 默认写入，先使用 `--dry-run` 检查变更。题目及内嵌的 `answerSources` 位于 `data/questions`，面经证据位于 `data/evidence`；这些维护数据不会发布到浏览器。

## 构建与验证

`app.js`、`styles.css` 和 `questions.js` 都是生成文件，不要直接编辑。

```powershell
pnpm build
pnpm run typecheck
pnpm run lint
pnpm run test:coverage
pnpm run test:e2e
pnpm verify
```

`pnpm build` 从 TypeScript、CSS 和作者数据重建公开产物并执行题库一致性检查。`pnpm verify` 在构建后运行完整检查与 file:// E2E。

## 发布

GitHub Pages 工作流会先调用完整 CI，再把以下文件复制到临时发布目录：

```text
index.html
app.js
styles.css
questions.js
.nojekyll
```

`data/`、`tools/`、测试、源码和面经证据不会进入 Pages artifact。
