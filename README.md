# WebGIS LowCode Editor

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-brightgreen" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.x-purple" alt="Vite">
  <img src="https://img.shields.io/badge/ElementPlus-2.x-409eff" alt="Element Plus">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

一款基于 Vue 3 + TypeScript 的**数据可视化大屏低代码搭建平台**，支持拖拽式组件编排、实时预览、AI 智能生成、多页面代码导出等功能。

### 预览地址：https://webgis-lowcode-editor.vercel.app/ （需科学上网）

### 后端地址：https://webgis-lowcode-editor.onrender.com （需科学上网）

### 组件库文档地址：https://visual-lib-docs.vercel.app/ （需科学上网）

<img width="2514" height="1275" alt="屏幕截图 2025-12-01 203042" src="https://github.com/user-attachments/assets/e99440b5-081d-4909-a040-f8331a123782" />

## ✨ 特性

- 🎨 **可视化拖拽编辑** - 拖拽组件到画布，所见即所得
- 📊 **丰富的组件库** - 图表、KPI、地图、表格、控件等 50+ 组件
- 🤖 **AI 智能助手** - 支持 Gemini、OpenAI、Claude、通义千问、DeepSeek 等多模型（预览地址目前用的是 Gemini 的免费 API）
- 🗺️ **WebGIS 支持** - 集成地图组件，支持瓦片、矢量、热力图等图层
- 🎯 **事件联动系统** - 支持条件执行、自定义脚本、跨组件事件联动
- 📱 **响应式设计** - 支持多种屏幕尺寸适配
- 🌙 **深色模式** - 内置明暗主题切换
- 💾 **模板系统** - 预设模板快速创建大屏
- 🧩 **内置组件库包** - 通过 `@twi1i9ht/visual-lib` 提供图表 / KPI / 布局 / 地图等组件

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9 或 pnpm >= 8

### 安装

```bash
# 克隆项目
git clone https://github.com/TWILIGHT-wyf/webgis.git
cd webgis

# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发

```bash
# 启动前端开发服务器
pnpm dev

# 启动后端（AI 代理 / 项目管理）服务
pnpm dev:server

# 前后端一起启动
pnpm dev:all
```

前端默认访问地址：http://localhost:5173
后端默认访问地址：http://localhost:3001

### 构建

```bash
# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

## 📦 组件库

### 图表组件

- 折线图、柱状图、堆叠柱状图
- 饼图、环形图、雷达图
- 仪表盘、漏斗图、桑基图、散点图

### KPI 指标

- 统计卡片、数字滚动、进度条
- 徽章、信息盒子、文本

### 数据展示

- 数据表格、列表、时间线
- 卡片网格、透视表

### 控件

- 下拉选择、多选、日期范围
- 搜索框、滑块、开关
- 复选框组、按钮组

### 地图组件

- 基础地图、瓦片图层、矢量图层
- 标记点、聚合、热力图
- 图例、比例尺、图层控制

### 布局组件

- 行、列、弹性布局、网格
- 面板、标签页、弹窗

## 🤖 AI 助手

内置 AI 智能助手，支持多家 AI 提供商：
（目前只测试了Gemini）
| Provider | 服务商 | 网络 |
|----------|--------|------|
| `gemini` | Google Gemini | 需代理 |
| `openai` | OpenAI GPT | 需代理 |
| `claude` | Anthropic Claude | 需代理 |
| `qwen` | 阿里通义千问 | 国内直连 |
| `deepseek` | DeepSeek | 国内直连 |

### 启动 AI 代理服务器

```bash
cd server
pnpm install   # 或 npm install
pnpm start -- --key=你的API密钥 --provider=gemini
```

## 🧪 测试

```bash
# 单元测试（Vitest）
pnpm test:unit

# E2E 测试（Playwright）
pnpm test:e2e

# 只跑所有单元测试（CI 常用）
pnpm test -- --run

# 代码检查（ESLint）
pnpm lint
```

## 📁 项目结构

```
webgis/
├── src/
│   ├── components/        # 编辑器 UI 组件（画布、侧边栏、头部等）
│   ├── customComponents/  # 低代码可拖拽组件库（图表 / KPI / 布局 / 地图等）
│   ├── datasource/        # 数据源 Hook（如 useDataSource）
│   ├── stores/            # Pinia 状态管理（项目 / 组件 / 画布尺寸等）
│   ├── services/          # 服务层（AI、HTTP、项目接口）
│   ├── templates/         # 内置大屏模板配置
│   ├── utils/             # 工具方法（如项目代码生成 projectGenerator、toCode 等）
│   └── views/             # 页面视图（编辑器 / 运行时多页面预览）
├── packages/
│   └── visual-lib/        # 独立组件库包 @twi1i9ht/visual-lib（支持单独发布）
├── server/                # 后端服务（AI 代理、项目存储、Mock 数据等）
├── tests/                 # 测试（unit / integration / e2e）
└── dist/                  # 生产构建输出
```

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建**: Vite
- **UI**: Element Plus
- **状态**: Pinia
- **图表**: ECharts
- **地图**: Leaflet
- **测试**: Vitest + Playwright

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 致谢（Acknowledgements）

本项目在设计和实现上深受以下优秀开源项目启发，特此感谢并致敬：

- **visual-drag-demo** — https://github.com/woai3c/visual-drag-demo  
  作者 / 维护者：[@woai3c](https://github.com/woai3c)

- **vue-form-design** — https://github.com/337547038/vue-form-design  
  作者 / 维护者：[@337547038](https://github.com/337547038)

### 核心依赖库

本项目得益于以下优秀的开源库：

| 库               | 用途             | 链接                                  |
| ---------------- | ---------------- | ------------------------------------- |
| **Vue 3**        | 前端框架         | https://vuejs.org/                    |
| **Vite**         | 构建工具         | https://vitejs.dev/                   |
| **Element Plus** | UI 组件库        | https://element-plus.org/             |
| **ECharts**      | 图表库           | https://echarts.apache.org/           |
| **vue-echarts**  | Vue ECharts 封装 | https://github.com/ecomfe/vue-echarts |
| **Leaflet**      | 地图库           | https://leafletjs.com/                |
| **Pinia**        | 状态管理         | https://pinia.vuejs.org/              |
| **TypeScript**   | 类型系统         | https://www.typescriptlang.org/       |
| **Vitest**       | 单元测试         | https://vitest.dev/                   |
| **Playwright**   | E2E 测试         | https://playwright.dev/               |
| **VitePress**    | 文档生成         | https://vitepress.dev/                |
| **marked**       | Markdown 解析    | https://marked.js.org/                |
| **highlight.js** | 代码高亮         | https://highlightjs.org/              |

如果你是上述项目的作者或维护者，若希望我更改致谢方式或补充更详尽的署名，请在 Issue 中告知，我会及时更新。

---

<p align="center">
  感谢使用 <strong>WebGIS LowCode Editor</strong>！
</p>
<p align="center">
  如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！
</p>
