# PWA 首屏加载性能优化设计

## 问题

FitTrack PWA 首屏加载 > 3.8 MB 资源，其中 2.5 MB（65%）是 Tailwind 全量 CSS + 运行时编译器 + 非首屏库。用户在中国大陆，所有资源需自托管。

## 当前资源分析

| 文件 | 大小 | 首屏必需 |
|------|------|----------|
| full.min.css | 2.1 MB | 否（全量未 purge） |
| tailwindcss.js | 407 KB | 否（运行时编译器） |
| echarts.min.js | 1.0 MB | 否（仅历史 tab 用） |
| browser-image-compression.js | 57 KB | 否（仅头像上传） |
| vue.global.prod.js | 162 KB | 是 |
| vue-router.global.prod.js | 27 KB | 是 |
| axios.min.js | 33 KB | 是 |
| pinia.iife.min.js | 22 KB | 是 |
| vue-demi.js | 3.6 KB | 是 |

## 改动

### 1. Tailwind CSS 构建化（-2.4 MB）

- 将 `<script>` 内 tailwind.config 提取为 `tailwind.config.js`
- 新建 `input.css`，含 `@tailwind base/components/utilities` 和 daisyui plugin
- 新增 `build:css` script：`npx tailwindcss -i input.css -o lib/fittrack.min.css --minify --content './index.html'`
- `npm start` 用 `build:css && vercel dev`
- index.html：删除 `lib/full.min.css` 和 `lib/tailwindcss.js`，引用 `lib/fittrack.min.css`
- 删除内联 `<script> tailwind.config = {...} </script>` 块
- 构建后 CSS 预计 50-80 KB

### 2. ECharts 懒加载（-1.0 MB 首屏）

- 删除 `<script src="./lib/echarts.min.js">` 静态引用
- 在 Dashboard 组件内增加 `echartsReady` 状态
- `switchTab('history')` 中动态创建 `<script>` 标签加载 echarts，完成后初始化
- 首屏不再加载 echarts

### 3. browser-image-compression 懒加载（-57 KB 首屏）

- 删除 `<script src="./lib/browser-image-compression.js">` 静态引用
- AvatarUploadModal 的 `confirm()` 中按需动态加载

### 4. API 并行化

- `onMounted` 中将 `fetchActions()` / `fetchHistory('today')` / `fetchHistory('all')` 改为 `Promise.all` 并行

### 不改

- Service Worker（cache-first 已合理）
- 单文件架构保持
- 所有库继续自托管
- Vercel hkg1 部署配置

## 预估效果

- 首屏资源：3.8 MB → ~300 KB（减少 92%）
- 首屏加载时间：预计减少 80%+
