# C++ 面试题库

这是一个无需构建工具的静态站点，题库数据和页面脚本都在仓库根目录。

标准 C++ 题使用逐题对应的 cppreference 主题页；GoF、UE5 和 Windows 题直接在题目下显示按权威资料整理的口述简答，并以文字标注来源，不保留外部链接。

## 本地打开

直接双击 `index.html`，或在浏览器地址栏输入它的 `file://` 路径即可打开。页面只读取同目录下的 `styles.css`、`app.js` 和 `questions.js`，不需要本地服务器，也不会向本项目传递令牌。

## 创建仓库并推送

1. 在 GitHub 新建一个空仓库。仓库名可自定义；不要勾选自动生成 README、`.gitignore` 或许可证。
2. 在本目录执行：

   ```powershell
   git init
   git add index.html styles.css app.js questions.js .nojekyll README.md .github/workflows/pages.yml
   git commit -m "发布 C++ 面试题库静态站点"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

   将远程地址中的占位符替换为实际用户名和仓库名。推送使用你本机 GitHub 凭据或 SSH 配置；本项目不会保存或传递任何令牌。

## 开启 GitHub Pages

1. 打开仓库的 **Settings > Pages**。
2. 在 **Build and deployment** 的 **Source** 中选择 **GitHub Actions**。
3. 再次推送到 `main`，或在 **Actions** 页面手动运行 **Deploy static site to GitHub Pages**。
4. 工作流完成后，Pages 页面会显示站点地址，通常是 `https://<你的用户名>.github.io/<仓库名>/`。

工作流使用 GitHub 官方的 `actions/configure-pages`、`actions/upload-pages-artifact` 和 `actions/deploy-pages`，发布仓库根目录的静态文件。
