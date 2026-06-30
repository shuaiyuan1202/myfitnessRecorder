# PWA 首屏加载性能优化 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 PWA 首屏加载从 3.8 MB 降至 ~300 KB，减少 92%

**架构：** 四项独立改动——Tailwind CSS 构建化（核心收益）、ECharts 懒加载、browser-image-compression 懒加载、API 并行化。不改动 Vue 组件逻辑和服务端代码。

**技术栈：** Tailwind CSS v3 + DaisyUI v4（npm 构建），Vue 3 全局构建版（自托管），Vercel Functions 后端

---

### 任务 1：Tailwind CSS 构建化

**文件：**
- 创建：`tailwind.config.js`
- 创建：`input.css`
- 修改：`package.json`
- 修改：`index.html`（移入 ./lib/fittrack.min.css，移出 full.min.css + tailwindcss.js + 内联 config）

- [ ] **步骤 1：安装 tailwindcss v3 和 daisyui 作为 devDependencies**

```bash
cd /Users/shuai.yuan/Downloads/personal/project/myfitnessRecorder
npm install --save-dev tailwindcss@3 daisyui@4
```

- [ ] **步骤 2：建立 tailwind.config.js**

将 index.html 第 217-381 行的内联 tailwind.config 提取出来，只加 content 路径：

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        fittrack: {
          "primary": "#6366f1",
          "secondary": "#ec4899",
          "accent": "#8b5cf6",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        red: {
          "primary": "#ef4444",
          "secondary": "#f87171",
          "accent": "#b91c1c",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#fef2f2",
          "base-300": "#fee2e2",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        black: {
          "primary": "#1f2937",
          "secondary": "#374151",
          "accent": "#000000",
          "neutral": "#111827",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        green: {
          "primary": "#10b981",
          "secondary": "#34d399",
          "accent": "#059669",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#ecfdf5",
          "base-300": "#d1fae5",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        blue: {
          "primary": "#3b82f6",
          "secondary": "#60a5fa",
          "accent": "#2563eb",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#eff6ff",
          "base-300": "#dbeafe",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        orange: {
          "primary": "#f97316",
          "secondary": "#fb923c",
          "accent": "#ea580c",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#fff7ed",
          "base-300": "#ffedd5",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        cyan: {
          "primary": "#06b6d4",
          "secondary": "#22d3ee",
          "accent": "#0891b2",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#ecfeff",
          "base-300": "#cffafe",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
```

- [ ] **步骤 3：建立 input.css**

```css
/* input.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **步骤 4：执行 CSS 构建**

```bash
cd /Users/shuai.yuan/Downloads/personal/project/myfitnessRecorder
npx tailwindcss -i input.css -o lib/fittrack.min.css --minify
```

预期输出：`lib/fittrack.min.css` 文件生成，大小应该在 50-100 KB 之间（而非 2.1 MB）。

- [ ] **步骤 5：验证构建产物**

```bash
ls -lh lib/fittrack.min.css
```

预期：文件存在且大小远小于 `lib/full.min.css`。确认文件开头不是空文件。

- [ ] **步骤 6：Commit Tailwind 构建设置**

```bash
git add tailwind.config.js input.css lib/fittrack.min.css package.json package-lock.json
git commit -m "build: replace runtime tailwind with build-time purged CSS"
```

---

### 任务 2：更新 index.html 资源引用

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：移除旧 CSS/JS 引用和内联 tailwind.config**

删除以下三段（第 18-19 行的 link + script，第 216-382 行的内联 `<script> tailwind.config = {...} </script>`）：

要删除的内容（精确匹配）：

```html
  <!-- Tailwind & DaisyUI -->
  <link href="./lib/full.min.css" rel="stylesheet" type="text/css" />
  <script src="./lib/tailwindcss.js"></script>
```

和：

```html
  <script>
    tailwind.config = {
      theme: {
        extend: {},
      },
      daisyui: {
        themes: [
          {
            fittrack: {
              ...
```
到该 `</script>` 结束标签。

- [ ] **步骤 2：添加构建后的 CSS 引用**

在 `<head>` 中原位置替换为：

```html
  <!-- Tailwind & DaisyUI (build-time purged) -->
  <link href="./lib/fittrack.min.css" rel="stylesheet" type="text/css" />
```

- [ ] **步骤 3：Commit index.html 资源引用更新**

```bash
git add index.html
git commit -m "perf: replace full.min.css+tailwindcss.js with purged fittrack.min.css"
```

---

### 任务 3：ECharts 懒加载

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：移除 echarts 静态引用**

删除 index.html 第 32 行：

```html
  <script src="./lib/echarts.min.js"></script>
```

- [ ] **步骤 2：在 Dashboard setup() 中加入 echarts 动态加载逻辑**

在 Dashboard 的 `setup()` 函数中（`const isAnimating = ref(false);` 附近，约第 2006 行），新增状态和加载函数：

```js
// ECharts 懒加载
const echartsReady = ref(typeof echarts !== 'undefined');
let echartsLoading = false;

const loadEcharts = () => {
  if (echartsReady.value || echartsLoading) return;
  echartsLoading = true;
  const script = document.createElement('script');
  script.src = './lib/echarts.min.js';
  script.onload = () => {
    echartsReady.value = true;
    echartsLoading = false;
  };
  document.head.appendChild(script);
};
```

- [ ] **步骤 3：修改 switchTab 触发加载**

修改 `switchTab` 函数（第 2585 行附近），在切换到 history 时先加载 echarts：

```js
const switchTab = async (tab) => {
    activeTab.value = tab;
    if (tab === 'history') {
        if (!echartsReady.value) {
            loadEcharts();
        }
        if (allHistory.value.length === 0) {
            await fetchHistory('all');
        }
    }
    if (tab === 'pump' && pumpData.value.length === 0) {
        await fetchPumpData();
    }
};
```

- [ ] **步骤 4：修改 watch(activeTab) 等待 echarts 就绪**

修改第 3280 行的 `watch(activeTab, ...)`：

```js
watch(activeTab, (val) => {
     if (val === 'history') {
         const tryInit = () => {
             if (echartsReady.value) {
                 setTimeout(() => {
                     buildRadarSnapshots();
                     initRadarChart();
                 }, 100);
             } else {
                 setTimeout(tryInit, 100);
             }
         };
         tryInit();
     } else {
         stopRadarPlayback();
     }
});
```

- [ ] **步骤 5：修改 watch(allHistory) 加 echarts 就绪检查**

修改第 3291 行的 `watch(allHistory, ...)`：

```js
watch(allHistory, () => {
     if (activeTab.value === 'history' && echartsReady.value) {
         setTimeout(() => {
             buildRadarSnapshots();
             initRadarChart();
         }, 100);
     }
});
```

- [ ] **步骤 6：在 setup() 的 return 对象中加入 echartsReady**

在 return 对象中添加 `echartsReady`（第 3640 行附近）：

```js
echartsReady,
```

- [ ] **步骤 7：Commit echarts 懒加载**

```bash
git add index.html
git commit -m "perf: lazy load echarts only when history tab is opened"
```

---

### 任务 4：browser-image-compression 懒加载

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：移除 browser-image-compression 静态引用**

删除 index.html 第 26 行：

```html
  <script src="./lib/browser-image-compression.js"></script>
```

- [ ] **步骤 2：在 AvatarUploadModal 的 confirm() 中按需加载**

修改 AvatarUploadModal 的 `confirm` 方法（第 1767 行）。在方法开头，使用 `window.imageCompression` 之前，加入动态加载逻辑：

```js
const confirm = async () => {
  if (!imageLoaded.value || props.loading) return;
  
  // 按需加载 browser-image-compression
  if (!window.imageCompression) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './lib/browser-image-compression.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load image compression'));
      document.head.appendChild(script);
    });
    if (!window.imageCompression) {
      alert('图片处理组件加载失败，请刷新页面重试');
      return;
    }
  }

  const image = img.value;
  // ... 后续代码不变
```

- [ ] **步骤 3：Commit browser-image-compression 懒加载**

```bash
git add index.html
git commit -m "perf: lazy load browser-image-compression only when uploading avatar"
```

---

### 任务 5：API 调用并行化

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：将 onMounted 中的串行调用改为并行**

修改 onMounted 中的 3 个 await（第 2299-2301 行），从：

```js
            await fetchActions();
            await fetchHistory('today');
            await fetchHistory('all');
```

改为：

```js
            await Promise.all([
              fetchActions(),
              fetchHistory('today'),
              fetchHistory('all')
            ]);
```

三个 API 调用互不依赖（fetchActions 和 fetchHistory 各调各的），可以安全并行。

- [ ] **步骤 2：Commit API 并行化**

```bash
git add index.html
git commit -m "perf: parallelize API calls on dashboard mount"
```

---

### 任务 6：最终验证

- [ ] **步骤 1：启动本地服务器**

```bash
cd /Users/shuai.yuan/Downloads/personal/project/myfitnessRecorder
npm start
```

- [ ] **步骤 2：浏览器中打开 DevTools → Network 面板，硬刷新**

确认：
- `fittrack.min.css` 加载正常，大小 ~50-100 KB
- `full.min.css` 和 `tailwindcss.js` 不再出现在请求列表中
- `echarts.min.js` 不在首屏请求中，点"历史"tab 后才出现
- `browser-image-compression.js` 不在首屏请求中，点头像上传 modal 后才出现
- 页面渲染正确，颜色、主题、DaisyUI 组件样式正常
- 登录、记录提交、历史切换功能正常

- [ ] **步骤 3：如果一切正常，Commit 无额外文件变更，或直接部署验证**

```bash
# 确认没有需要额外保存的文件
git status
```
