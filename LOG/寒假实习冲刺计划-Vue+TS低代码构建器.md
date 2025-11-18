# 寒假实习冲刺计划（Vue + TypeScript + 低代码构建器旗舰项目）

> 目标：在寒假前后拿到前端实习 Offer。以“深入 Vue 的低代码表单/报表构建器”为旗舰项目，配套系统化技能学习（TypeScript、Element Plus、工程化、性能优化），形成可展示、可复用、可扩展的技术作品与面试素材。

---

## 1. 总体目标（可量化）

- 作品集：
  - 完成并上线 2 个可演示项目（Task-Pro 后台 + 低代码构建器），各含：在线 Demo、3 分钟演示视频、详尽 README、性能与测试数据。
- 技术深度：
  - 熟练掌握 TypeScript（类型系统、泛型、类型守卫、声明与定义文件）。
  - 熟练使用 Element Plus（表单、表格、弹窗、虚拟滚动/大数据表格方案）。
  - Vue 3 进阶（组合式 API、渲染与调度、动态组件、异步组件、指令、插件）。
  - 工程化与质量保障（Vitest、E2E、CI、Lint、Release 流程）。
- 面试准备：
  - 高频问答与项目复盘稿各 1 份；3 场以上模拟面试；有效投递 ≥50 家。

---

## 2. 学习路线（在你“先掌握 TypeScript、了解 Element Plus”的想法上扩展）

### 2.1 TypeScript（第 1–2 周并贯穿实践）

- 核心：基础类型、类型推导、联合与交叉、字面量与枚举、泛型、条件类型、映射类型、类型收窄、`unknown`/`never`、`as const`、声明合并。
- Vue 相关：`DefineComponent`、`Ref`/`ComputedRef`、`reactive` 类型、`emit/props` 类型、`defineProps/defineEmits` 泛型、`slots` 类型；Pinia store 类型推导与插件类型扩展。
- 输出：为 `utils/format.ts` 与 `useTableOperations.ts` 增加完整类型；为通用组件补齐 props/事件类型与文档。

### 2.2 Element Plus（第 1–3 周）

- 组件体系：Form、FormItem、Input、Select、Cascader、Table、Pagination、Dialog、Drawer、Descriptions、Tree、Upload、AutoComplete。
- 表格进阶：懒加载、虚拟滚动（可结合 `el-virtualized-table` 或社区方案）、服务端分页与远程搜索、合计与汇总、行内编辑。
- 表单进阶：自定义校验（和 VeeValidate/Zod 集成）、联动与依赖、动态渲染。
- 输出：封装一套“Schema → Element Plus 表单/表格”的渲染层。

### 2.3 Vue 深入（第 2–6 周）

- 组合式与复用：自写 6+ `composables`（请求缓存、权限、媒体查询、主题、可见性、联动规则引擎）。
- 动态/异步组件：`resolveDynamicComponent`、`defineAsyncComponent`、`keep-alive` 策略。
- 指令与插件：按钮级权限指令 `v-permission`、消息/确认服务、Pinia 持久化插件。
- 性能：代码分割与路由懒加载、虚拟列表、长任务切片（`requestIdleCallback`）、ECharts 大数据优化（抽样/降采样）。

### 2.4 工程化与质量（全程推进）

- 测试：Vitest + @vue/test-utils（组件单测）、Playwright/Cypress（E2E）。
- 自动化：GitHub Actions（Lint/Test/Build/Preview）、Release please、Commitlint、Changeset。
- 可观测：Sentry（前端报错收集）、Web Vitals（Lighthouse 指标记录）。

---

## 3. 旗舰项目：低代码表单/报表构建器（Vue 深度展示）

### 3.1 项目简介

- 通过拖拽/配置生成表单与报表，支持：
  - Schema 驱动渲染（表单/报表统一描述）
  - 联动规则引擎（显隐、校验、计算、禁用、默认值）
  - 数据源适配（REST/Mock/自定义函数）
  - 报表可视化（ECharts：柱状/折线/饼图/仪表盘等）
  - 导出（CSV/XLSX/PDF，可选）
  - 插件化扩展（自定义组件/规则/数据源）

### 3.2 技术选型

- Vue 3 + TS、Pinia、Vue Router、Element Plus、VeeValidate/Zod、ECharts、Vite、VitePress/Storybook（文档/组件展示）。

### 3.3 功能模块

- 画布与面板：组件库面板、属性面板、层级与大纲、拖拽摆放与栅格布局。
- Schema 引擎：
  - 定义统一 Schema（字段、UI、校验、联动、布局）。
  - 运行时渲染引擎（动态组件注册、事件转发、性能优化）。
- 联动规则：
  - 基于表达式/函数/事件流的规则系统，支持依赖跟踪与最小化刷新。
- 数据源与适配器：
  - REST/GraphQL/自定义函数；缓存与重试；分页与筛选协议。
- 报表：
  - 绑定数据 → 数据转换 → 图表组件（option 生成与主题）。
- 导出与分享：
  - CSV/XLSX（papaparse/xlsx）、PDF（可选 `jspdf`）。
- 插件：
  - 组件插件、规则插件、数据源插件，版本兼容与沙箱隔离（可先做约定式）。

### 3.4 难点与解决思路

- 性能：
  - 大表单虚拟化、分片渲染、依赖图最小化更新、懒加载字段编辑器。
- 规则执行顺序与可观测性：
  - 拓扑排序/依赖跟踪、调试面板（规则执行日志/依赖图可视化）。
- Schema 兼容与迁移：
  - 版本号与迁移器（migrator），变更日志与示例。

### 3.5 可量化验收

- 20+ 内置控件、10+ 联动规则；
- 渲染 200+ 表单项 < 200ms（分批/虚拟化）；
- 4 类及以上图表、2 个外部插件示例；
- 单测 ≥ 30、文档站 1 套（含示例与演示动图）。

---

## 4. 8 周时间表（周目标与交付物）

### 第 1–2 周：TypeScript + Element Plus 打底 & 现有项目打磨

- 学习：TS 进阶（泛型、条件类型、类型工具）、Element Plus 表单/表格/弹窗。
- 实践：
  - 给 Task-Pro 补齐：统一格式化函数、空态/错误态、图表交互细节。
  - 将 `utils`/`composables`/关键组件迁移至 TS。
- 交付：线上部署、3 分钟视频、README 完善、Vitest 20+ 用例、2 条 E2E。

### 第 3 周：旗舰项目搭架子

- 完成项目初始化、目录/约定、TS 严格模式、ESLint/Prettier、路由与 Pinia。
- 实现画布与组件面板（静态）、Schema 定义初版、动态渲染 PoC。
- 交付：PoC Demo、技术选型说明、里程碑与 issue 列表。

### 第 4 周：表单 Schema 引擎（v1）

- 字段类型 10+、基础校验、简单联动（显隐/禁用/默认值），属性面板编辑。
- 远程数据源 select/cascader 的远程搜索与缓存。
- 交付：组件演示页、单测 10+、文档初稿。

### 第 5 周：规则引擎与性能优化

- 规则 DSL/函数、依赖跟踪与拓扑排序、事件驱动更新、最小刷新。
- 大表单性能：分片渲染/虚拟列表；异步校验与节流。
- 交付：性能对比报告、调试面板（规则日志）。

### 第 6 周：报表与导出

- 数据转换 pipeline、ECharts 可视化组件（折线/柱状/饼/仪表），主题切换。
- 导出 CSV/XLSX、报表 Schema 与渲染。
- 交付：报表示例页、导出功能演示。

### 第 7 周：插件机制与文档站

- 组件/规则/数据源插件机制；两个插件实例（如“身份证校验字段”“ElasticSearch 数据源”）。
- VitePress 文档站：入门、Schema 规范、API 参考、最佳实践与 FAQ。
- 交付：文档站上线、插件示例仓库。

### 第 8 周：打磨与求职准备

- 完善类型与注释；补齐单测到 30+；Cypress/Playwright 跑关键 E2E。
- 制作 3 分钟项目演示视频、整理 STAR 复盘稿、硬指标（性能/覆盖率）。
- 投递渠道列表与跟踪表；模拟面试 2 场，修订问答稿。

---

## 5. 交付物清单（验收标准）

- 两个项目的线上地址、仓库链接、README、性能报告、测试覆盖率截图。
- 演示视频各 1 个（≤3 分钟），包含核心功能与难点说明。
- 面试问答稿与项目 STAR 复盘稿（含数据指标、对比前后）。
- 投递跟踪表与每周复盘记录。

---

## 6. 面试准备（高频题方向）

- Vue：响应式原理、渲染与调度、diff 与 key、异步组件、keep-alive、指令与插件。
- 组件设计：受控/非受控、可组合性、可扩展性、错误边界与可访问性。
- 工程：模块拆分、按需加载、性能优化策略、测试金字塔、CI/CD。
- 网络与缓存：SWR/ISR、etag、重试与退避、错误处理与兜底。
- 安全：XSS、CSRF、路由守卫、RBAC 按钮级权限。

---

## 7. 跟踪与复盘模板

- 周目标：
  - 本周完成：
  - 未完成与原因：
  - 下周计划：
  - 风险与缓解：
- 指标看板：
  - 用例数 / 通过率 / 覆盖率
  - Lighthouse 指标（LCP/CLS/TTI/Score）
  - 构建体积 / Chunk 数
  - PR 数 / Issue 完成数

---

## 8. 推荐资源

- TypeScript：TS Handbook、Effective TypeScript、type-challenges
- Vue：Vue 官方文档、VueUse、Vue School/Vue Mastery（可选）
- Element Plus：文档与源码阅读（表格/表单）
- 测试：Vitest、@vue/test-utils、Cypress/Playwright
- 可视化：ECharts 手册、AntV 文章、数据可视化最佳实践
- 工程化：VitePress、GitHub Actions、Sentry、Lighthouse

---

> 行动建议：
>
> - 今天：确认旗舰项目仓库与初始脚手架、列出 issue 清单与里程碑；梳理 TS 学习计划与每日任务番茄钟。
> - 本周：完成 TypeScript 与 Element Plus 打底 Demo；现有项目补齐与 TS 改造一部分；制定下周的 Schema 与联动设计稿。

---

## 9. 可执行清单（逐项打勾）

> 说明：以下清单已拆到“天/周/模块”，附验收标准（Acceptance Criteria）。你可以把每个子清单复制成单独待办。

### 9.1 本周任务（样例，可复制为 Week-1）

- [ ] TypeScript 打底：
  - [ ] 阅读 TS Handbook：类型系统、泛型、类型守卫（做 10 道 type-challenges 简题）
  - [ ] 将 `src/utils/format.js` 迁移为 `format.ts`，补充类型与注释
  - 验收：`npm run test:run` 全绿，新增 3 条边界用例（非法日期、本地化货币、小数精度）
- [ ] Element Plus 练习：
  - [ ] 用 ElForm + 自定义校验实现“注册表单”Demo（含级联/远程搜索）
  - [ ] 用 ElTable 实现“服务端分页 + 远程筛选 + 合计行”的列表页 Demo
  - 验收：两个 Demo 可复用，README 附截图与要点
- [ ] 现有项目（Task-Pro）补强：
  - [ ] 提取 ECharts 数据转换为独立模块（`src/utils/chartTransform.ts`）
  - [ ] 为 `useTableOperations` 增加导出 CSV/XLSX 的数据清洗函数与 4 条单测
  - 验收：新增单测通过，README 增加“测试与架构”说明

### 9.2 每日节奏与打卡模板（可复制）

- 每日（2–4 小时）：
  - [ ] 90 分钟编码实现（围绕清单中 1 个小目标）
  - [ ] 30 分钟补/写测试（单元/组件/E2E 二选一）
  - [ ] 30–60 分钟 JS/TS 学习（做 2–3 道题或读 1 篇文档）
- 打卡模板：
  - 今日完成：……（代码/测试/文档链接）
  - 今日问题：……（如何解决/待求助）
  - 明日计划：……（下一个最小闭环）

### 9.3 项目内重构与单测任务清单（当前仓库）

- utils 与工具层：
  - [ ] `src/utils/format.js` → `format.ts`（迁移为 TS）
  - [ ] 扩充单测场景：格式化精度、负值、空值、极端日期（1970/闰年）
  - [ ] 新增 `number.ts`：安全加减/大数处理（可选）
- 请求与数据层：
  - [ ] `src/utils/request.js` 增强：重试（指数退避 3 次）、取消请求（AbortController）、错误分类与统一提示
  - [ ] 单测不少于 6 条：成功/超时/重试达到上限/手动取消/错误码分支
- 组合式函数：
  - [ ] `src/composables/useTableOperations.js` 拆分：数据获取层（纯函数）+ UI 状态层
  - [ ] 单测覆盖：分页计算、筛选清洗、批量删除/状态切换、导出数据整形（≥8 条）
- 可视化层：
  - [ ] 抽出 `chartTransform.ts`：输入（原始数据 + timeRange）→ 输出（options 片段）
  - [ ] 单测覆盖：不同 timeRange 下的聚合正确性；空数据/异常数据回退
- 文档与演示：
  - [ ] 在 README 增加“测试覆盖/质量门槛”章节（贴通过截图）
  - [ ] 录制 30–60 秒动图：表格导出、图表范围切换

### 9.4 JS/TS 强化日练清单

- 语言与机制：
  - [ ] 手写：debounce、throttle（已有实现，完善成代码 + 讲解稿）
  - [ ] 手写：并发限制器（队列版）、Promise.allSettled、事件总线
  - [ ] 题目：闭包/原型/this/宏微任务序列（各 3 题）
- 数据结构与算法：
  - [ ] Map/Set/WeakMap 应用；LRU 缓存实现
  - [ ] 拓扑排序（为“联动规则依赖”准备）
- TypeScript：
  - [ ] 为 `useTableOperations` 加入泛型参数，绑定“行数据类型”与“列定义”
  - [ ] 写 10 道 type-challenges（easy/medium）

### 9.5 面试准备与输出清单

- 项目讲解稿（STAR）：
  - [ ] 每个项目 1 份，含“背景/任务/行动/结果”，强调测试、重构、性能数字
- 高频问答：
  - [ ] Vue（响应式/调度/编译/keep-alive/指令/插件）、工程化（打包/分包/懒加载/CI）、网络与缓存（SWR/重试/退避）
- 演示与作品集：
  - [ ] 在线 Demo + 截图/动图 + README 完整
  - [ ] 3 分钟视频（包含难点与对比数据）

### 9.6 里程碑（Milestones）与风险预案

- Milestone-1（第 2 周末）：
  - 任务：TS/EP 打底完成，Task-Pro 单测 ≥20，两个 Demo 就绪
  - 预案：若进度落后，减少 Demo 数量，优先补测试与文档
- Milestone-2（第 4 周末）：
  - 任务：构建器 Schema 引擎 v1 + 10 控件 + 基础联动 + 文档初稿
  - 预案：联动复杂度超预期则先收敛范围，优先跑通 3 类核心规则
- Milestone-3（第 6 周末）：
  - 任务：报表可视化 + 导出管线 + 性能优化初步
  - 预案：若图表调优耗时，先完成数据转换与单测，后置主题与动画
- Milestone-4（第 8 周末）：
  - 任务：插件机制 + 文档站上线 + 面试材料齐备 + 投递
  - 预案：插件做 1 个 MVP 即可，把重点落在“讲透一个模块 + 质量闭环”

---

## 10. 每周复盘（模板）

- 本周目标完成度：✅/⚠️/❌（说明理由）
- 技术难点与解决：……（可附链接）
- 质量指标：测试数/覆盖率/构建体积/性能分
- 下周计划与风险：……（列出预案 A/B）
