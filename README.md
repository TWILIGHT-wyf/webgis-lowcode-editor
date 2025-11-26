# WebGIS LowCode Editor

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-brightgreen" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.x-purple" alt="Vite">
  <img src="https://img.shields.io/badge/ElementPlus-2.x-409eff" alt="Element Plus">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

一款基于 Vue 3 + TypeScript 的**数据可视化大屏低代码搭建平台**，支持拖拽式组件编排、实时预览、AI 智能生成等功能。
### 预览地址：https://webgis-lowcode-editor.vercel.app/  （要翻墙）
ai功能暂时还未部署上线
## ✨ 特性

- 🎨 **可视化拖拽编辑** - 拖拽组件到画布，所见即所得
- 📊 **丰富的组件库** - 图表、KPI、地图、表格、控件等 50+ 组件
- 🤖 **AI 智能助手** - 支持 Gemini、OpenAI、Claude、通义千问、DeepSeek 等多模型
- 🗺️ **WebGIS 支持** - 集成地图组件，支持瓦片、矢量、热力图等图层
- 🎯 **事件联动系统** - 组件间数据联动与交互
- 📱 **响应式设计** - 支持多种屏幕尺寸适配
- 🌙 **深色模式** - 内置明暗主题切换
- 💾 **模板系统** - 预设模板快速创建大屏

## 📸 预览

| 编辑模式 | 预览模式   |
| -------- | ---------- |
| `/`      | `/runtime` |

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9 或 pnpm >= 8

### 安装

```bash
# 克隆项目
git clone https://github.com/TWILIGHT-wyf/webgis.git
cd webgis

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
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
npm install
npm start -- --key=你的API密钥 --provider=gemini
```

详见 [AI 助手集成文档](./docs/AIAssistIntegration.md)

## 🧪 测试

```bash
# 单元测试
npm run test:unit

# E2E 测试
npm run test:e2e

# 代码检查
npm run lint
```

## 📁 项目结构

```
webgis/
├── src/
│   ├── components/        # 编辑器组件
│   │   ├── Editor/        # 画布、右键菜单、对齐等
│   │   └── siderBar/      # 侧边栏（属性、事件、动画）
│   ├── customComponents/  # 可视化组件库
│   │   ├── chart/         # 图表组件
│   │   ├── kpi/           # KPI 组件
│   │   ├── map/           # 地图组件
│   │   ├── data/          # 数据展示组件
│   │   ├── controls/      # 控件组件
│   │   └── layout/        # 布局组件
│   ├── stores/            # Pinia 状态管理
│   ├── services/          # 服务层（AI、HTTP）
│   └── pages/             # 页面（编辑态/运行态）
├── server/                # AI 代理服务器
├── docs/                  # 文档
└── test/                  # 测试文件
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

## 📝 开发计划

- [x] 核心拖拽编辑功能
- [x] 组件属性面板
- [x] 事件联动系统
- [x] AI 智能生成
- [ ] 数据源管理
- [ ] 协作编辑
- [ ] 更多图表类型
- [ ] 移动端适配

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

如果你是上述项目的作者或维护者，若希望我更改致谢方式或补充更详尽的署名，请在 Issue 中告知，我会及时更新。

---

<p align="center">
  感谢使用 <strong>WebGIS LowCode Editor</strong>！
</p>
<p align="center">
  如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！
</p>
