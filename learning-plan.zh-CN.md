# Vue 3 + TypeScript + WebGIS 实战教学计划（完整）

> 目标：通过一套企业级"智慧城市设施管理系统（WebGIS）"的循序渐进练习，系统掌握 Vue 3 + TypeScript + 地图可视化，在实际业务中独立完成地理信息系统开发、空间数据管理、地图交互、实时监控、权限与路由守卫、测试与工程化等工作。

## 总体成品与能力覆盖

- 最终成品：智慧城市设施管理系统（登录/权限、地图仪表盘、设施列表与空间筛选、设施创建编辑与地图选点、实时状态推送、路径规划、热力图与报表图表、国际化、离线地图缓存、自动化测试与 CI）。
- 能力覆盖：

## 架构与技术选型（生产级，简历友好）

为让项目在实际工作可落地、在简历上更亮眼，建议采用下列“常见且被广泛使用”的技术组合：

- 核心框架与构建：
  - Vue 3（Composition API + script setup）
  - Vite（开发/构建/代码分割/插件生态）
  - TypeScript（严格模式，API 全量类型化，GeoJSON 类型支持）
- 地图引擎与 GIS：
  - 地图库：Leaflet 5.x（轻量、开源、插件丰富）或 Mapbox GL JS（高级交互、3D 支持）
  - 地图插件：
    - Leaflet.markercluster（标记聚合，处理大量设施）
    - Leaflet.draw（绘制区域/路线/多边形）
    - Leaflet Routing Machine（路径规划与导航）
    - Leaflet.heat（热力图）
  - 数据格式：GeoJSON（标准地理数据格式）、TopoJSON（优化版）
  - 瓦片服务：OpenStreetMap（免费）、Mapbox（需 API 密钥，高性能）、高德/腾讯地图（国内）
- 组件库与样式体系：
  - UI：Element Plus（按需自动引入 via unplugin-auto-import/unplugin-vue-components）
  - 样式：Tailwind CSS + CSS Variables（主题化/暗色模式）
  - 图标：unplugin-icons（Iconify 生态）+ Font Awesome（地图图标）
- 数据与状态：
  - HTTP：Axios（带拦截器、取消、重试、超时、鉴权）
  - 数据获取与缓存：TanStack Query（请求缓存、重试、乐观更新、失效策略、离线）
  - 全局状态：Pinia（仅存跨页面/用户态、权限等，其余使用 Query 管）
  - 可选 GraphQL：Apollo Client（若后端提供 GraphQL）
- 表单与校验：
  - vee-validate + yup/zod（Schema 驱动表单与类型推断）
- 路由与权限：
  - Vue Router（带类型化 meta、导航守卫、动态路由/菜单、RBAC）
- 国际化与可访问性：
  - vue-i18n（类型安全的消息键）、基础 a11y 规范（语义化标签、组件可访问）
- 图表与可视化：
  - ECharts（按需引入，仪表盘与统计报表）+ ECharts 地图扩展（与 Leaflet 联动）
  - D3.js（可选，高级可视化）
- 实时与通知：
  - socket.io-client（实时设施状态更新/位置追踪/消息通知）
  - MQTT.js（可选，IoT 设备数据接入）
- 监控与可观测性：
  - Sentry（前端错误上报 + Source Map）、日志采集与统一错误模型
- Mock 与测试：
  - MSW（服务端 Mock）、Vitest + Vue Test Utils（单测/组件测）、Playwright（E2E）
- 质量与流程：
  - ESLint（typescript-eslint flat config）+ Prettier
  - Husky + lint-staged（提交前校验）
  - commitlint（约束提交信息，便于生成变更日志）
  - GitHub Actions（CI：Lint/Typecheck/Test/Build）
- 性能与体验：
  - 路由与组件懒加载、按需引入、预加载/预取、虚拟滚动、骨架屏
  - 构建分析（rollup-plugin-visualizer）与关键路径优化
- PWA 与部署：
  - vite-plugin-pwa（离线地图瓦片缓存、安装到桌面、更新策略）
  - Docker（多阶段构建，Nginx 静态服务 + 地图瓦片代理），可一键部署至任意服务器/容器平台
- 可选进阶：
  - 三维地图：Cesium.js（3D 建筑与地形）、Three.js（自定义 3D 标记）
  - 空间分析：Turf.js（缓冲区分析、最近点查询、面积计算）
  - 离线地图：MBTiles（本地瓦片存储）、IndexedDB（大量 GeoJSON 缓存）

架构分层建议（自上而下）：pages → components（含地图组件）→ composables（useMap/useFacilities）→ services → api → http；types 为横切关注点（含 GeoJSON 类型）；以"领域/功能模块化"组织文件夹，暴露最小 API（index.ts barrel）。

## 扩展冲刺（可选但强烈推荐，用于打造“亮点”）

在前 8 个冲刺基础上，新增若干可独立推进的主题冲刺，每个都对应常见企业场景与简历亮点：

### 冲刺 A：设计系统与主题化（UI/Design System）

- 目标：统一组件风格、主题变量、暗色模式；抽象常用基础组件（Button、Modal、Form、DataTable）。
- 任务：
  - 引入 Element Plus 或 Naive UI，并配置自动按需导入与国际化。
  - Tailwind + CSS Variables 建立 design tokens（颜色、间距、字号、圆角）。
  - 实现暗色模式切换与主题持久化；抽象 2–3 个基础组件。
- 验收：主题切换无闪烁，基础组件覆盖 60% 以上常见场景；UI 一致性明显。

### 冲刺 B：数据获取与缓存（TanStack Query 深入）

- 目标：用 Query 接管列表详情、乐观更新、错误与重试策略、离线/前台恢复。
- 任务：
  - 配置 QueryClient（staleTime/cacheTime/retry/backoff）。
  - 工单列表分页 + 筛选使用 useQuery；工单更新/创建用 useMutation（乐观更新 + 失败回滚）。
  - 统一 queryKey 工具与失效策略。
- 验收：
  - 列表翻页/返回命中缓存即时渲染。
  - 断网后仍可查看已缓存数据，恢复网络自动重新验证。

### 冲刺 C：文件上传与大文件续传

- 目标：多文件上传、进度显示、取消与失败重试；可选分片/断点续传。
- 任务：
  - 上传组件（拖拽/选择）、进度条、并发队列与取消。
  - 可选：分片策略与断点续传（后端或本地模拟）。
- 验收：大文件上传稳定；取消/重试可控；上传后列表自动刷新。

### 冲刺 D：实时能力与消息通知

- 目标：接入 socket.io，实时推送工单状态变化与系统通知。
- 任务：
  - 建立连接、心跳与重连；前台/后台切换处理。
  - 列表/详情页实时无刷新更新。
- 验收：在另一个窗口变更数据，本窗口列表秒级同步。

### 冲刺 E：国际化与本地化（i18n）

- 目标：中英文切换、时区/日期、本地化格式；消息键类型提示。
- 任务：
  - 配置 vue-i18n，抽象 useI18nKey 辅助，提供键名类型提示。
  - 路由级语言切换与资源懒加载。
- 验收：语言切换覆盖 90%+ 页面元素；无明显布局抖动。

### 冲刺 F：图表与报表（ECharts）

- 目标：仪表盘可视化、筛选维度（时间、项目、状态）联动图表。
- 任务：
  - 组合式封装 useEcharts；按需加载图表组件与主题。
  - 多图联动与自适应。
- 验收：交互流畅、窗口 resize 与主题切换图表无异常。

### 冲刺 G：观测与稳定性（Sentry + 错误边界）

- 目标：前端错误可观测、归因与追踪；用户友好的故障回退。
- 任务：
  - 集成 Sentry，上传 Source Map；配置采样率与环境标签。
  - 全局错误边界组件与统一错误提示。
- 验收：可在监控平台准确看到错误堆栈与用户上下文。

### 冲刺 H：PWA 与离线优先

- 目标：关键页面离线可用，安装到桌面，更新策略可控。
- 任务：
  - 集成 vite-plugin-pwa，设定缓存策略（静态/接口）。
  - 自定义更新提示（新版本可用时提示刷新）。
- 验收：断网后仪表盘/工单列表可用（命中缓存）；可安装到桌面。

### 冲刺 I：E2E 与 CI/CD、Docker 化部署

- 目标：一键质量门禁与可复现部署。
- 任务：
  - Playwright E2E 覆盖核心流程；Vitest 单测补齐关键模块。
  - GitHub Actions：Lint/Typecheck/Test/Build；构建 Docker 镜像并产出工件。
  - Dockerfile（多阶段）+ Nginx（Gzip/Brotli/缓存头）。
- 验收：Pull Request 自动跑通流水线；本地/服务器一键启动镜像。

## 简历亮点（可直接粘贴，按实际完成情况勾选）

- 从 0 到 1 搭建 Vue 3 + TypeScript 企业级管理系统，建立严格类型基线与领域模型。
- 设计并实现 RBAC 权限系统（动态路由/菜单、按钮级权限、路由守卫）。
- 用 TanStack Query 接管数据层，实现缓存、重试、乐观更新与离线可用，提高交互时效。
- 复杂表单体系：Schema 驱动验证、动态联动、文件上传（进度/取消/断点续传）。
- 高性能列表：分页/排序/筛选 URL 同步、虚拟滚动、大数据量渲染优化。
- 国际化与主题：vue-i18n 类型安全键值、暗色模式、主题变量与设计系统。
- 可观测性：接入 Sentry，错误边界与统一错误模型，定位问题更高效。
- 自动化质量：Vitest + Vue Test Utils 单元/组件测试、Playwright E2E，CI 全链路（Lint/Typecheck/Test/Build）。
- 体验与性能：代码分割、按需加载、Prefetch/Preload、骨架屏、Suspense/KeepAlive。
- PWA 与部署：vite-plugin-pwa 离线使用、Docker 镜像化、Nginx 最佳实践；支持多环境配置。

## 展示与 Demo 建议

- 在线 Demo：部署到 Vercel/Netlify/GitHub Pages（带后端可用 Render/Fly.io/自托管）。
- 演示脚本：
  1. 登录与权限 → 2) 工单列表筛选分页 → 3) 创建/编辑工单（上传）→ 4) 实时推送 → 5) 仪表盘图表 → 6) 语言/主题切换 → 7) 离线访问。
- 截图与短视频：关键流程 5–8 张图 + 1 分钟短视频。
- 文档化：在 README 增加“特性亮点”“技术选型”“架构图”“如何运行/测试/部署”。

## 14 天加速路径（求职导向）

面向实习求职的“最快可见产出”路线，每天都有明确交付物与验收标准。

- Day 1 ｜工程基线
  - 交付：严格 TS、ESLint/Prettier、commitlint/Husky、路由骨架、Pinia 空仓库
  - 验收：npm run type-check 通过；提交钩子生效；页面可路由切换
- Day 2 ｜登录与权限雏形
  - 交付：Login 页、伪鉴权、守卫与受保护路由、角色占位
  - 验收：未登录拦截；登录后可达 Dashboard；刷新保持登录
- Day 3 ｜ UI 与布局
  - 交付：AppShell（Header/Sidebar/Main）、Element Plus 引入、导航菜单
  - 验收：布局无抖动，暗色/主题变量基础可切换
- Day 4 ｜地图基线（Leaflet）
  - 交付：MapView 组件、OSM 瓦片、比例尺/缩放控件、窗口自适应
  - 验收：地图能正常拖拽缩放，控制台无报错
- Day 5 ｜领域模型与 Mock 数据
  - 交付：Facility 类型、MSW Mock 列表/详情接口、服务层与 Store
  - 验收：列表页显示数据，加载/空态/错误覆盖
- Day 6 ｜地图标记与联动
  - 交付：根据列表在地图绘制 Marker；点击列表定位与高亮；Popup 展示概要
  - 验收：列表/地图双向联动；URL 同步选中 ID
- Day 7 ｜空间筛选（Draw + Turf）
  - 交付：矩形/多边形选择；点在多边形内筛选；显示命中数量
  - 验收：选择区域后列表与地图同步过滤
- Day 8 ｜数据获取与缓存（TanStack Query）
  - 交付：列表/详情 Query 化、错误重试、失效策略、加载占位
  - 验收：返回列表命中缓存即时渲染；断网后可看已缓存数据
- Day 9 ｜仪表盘可视化（ECharts）
  - 交付：状态占比、区域分布图；与地图筛选联动
  - 验收：切换筛选维度图表联动无卡顿
- Day 10 ｜性能与聚合
  - 交付：markercluster 聚合、列表虚拟滚动、构建分析与体积优化
  - 验收：5k 点位交互流畅；bundle 主包 < 300KB gzip（示例项目）
- Day 11 ｜国际化与可访问性
  - 交付：vue-i18n（中英双语）、基础 a11y 检查
  - 验收：语言切换 ≥ 90% 覆盖；无严重 a11y 报告
- Day 12 ｜ PWA 与离线
  - 交付：vite-plugin-pwa、关键页面与静态资源缓存、更新提示
  - 验收：断网可访问核心页面；更新提示可触发
- Day 13 ｜观测与稳定性
  - 交付：Sentry 接入、Source Map 上传、统一错误边界
  - 验收：能定位到源码行；错误有用户上下文
- Day 14 ｜ CI/CD 与部署
  - 交付：GitHub Actions（Lint/Typecheck/Test/Build）、Docker 镜像 + Nginx 配置
  - 验收：PR 自动跑通；本地一条命令启动容器

## 硬指标与验收标准（大厂风格）

- 性能（示例目标，按实际规模调整）：
  - 首屏 LCP < 2.5s（开发机 + 本地服务），地图交互 55–60 FPS
  - 主包 < 300KB gzip；懒加载路由；图表/地图按需引入
- 质量与稳定：
  - ESLint 0 error；Typecheck 0 error；单元/组件覆盖率 ≥ 80%
  - E2E 覆盖核心流程（登录、列表筛选、地图联动）
- 安全与合规：
  - 0 高危依赖漏洞（npm audit）
  - 禁用 eval/new Function；输出层统一转义；CSP Header 生效
  - 令牌不落磁盘（优先内存 + 刷新流），或落地需配合 httpOnly Cookie/刷新策略说明
- 可观测与运维：
  - Sentry DSN 分环境配置；Source Map 上传无失败
  - 关键路径埋点：页面进入、接口耗时、地图渲染耗时

## CI/CD 与工程规范

- 分支与提交：main（发布）、dev（集成）、feat/_、fix/_；Conventional Commits
- PR 审查清单：
  - [ ] typecheck/lint/test 通过
  - [ ] 变更含影响说明与截图/录屏
  - [ ] 新增 API/Store/Route 已补充类型与文档
  - [ ] 大对象/数组渲染提供 key；避免 O(n^2) 方案
- GitHub Actions（建议 Job）：
  - setup-node → install → lint → typecheck → unit → e2e（可选）→ build → docker build → 上传工件
- 规范工具：ESLint（flat）+ Prettier + lint-staged + commitlint + Husky pre-commit/pre-push

## 安全与合规（要点）

- Secrets：使用 .env.local/.env.production 与 GitHub Secrets；勿提交到仓库
- CSP：示例 Nginx 头部（可按需精简）
  - Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.example.com https://tiles.openstreetmap.org;
- 依赖与第三方：
  - 定期 npm audit；对地图/图表第三方资源声明来源与许可
  - 对外链/HTML 注入做转义/白名单
- 鉴权与权限：
  - Token 生命周期管理、刷新策略；路由与按钮级权限模型说明

## 简历与项目介绍模板（快抄版）

- 项目一句话：基于 Vue 3 + TS + Leaflet 的 WebGIS 管理系统，支持空间筛选、聚合、路径规划、实时推送与 PWA 离线。
- 个人担当：核心开发（架构/地图/数据层），完成 xx/xx 模块与 CI/CD。
- 难点与亮点：
  - 地图 5k+ 点位聚合与交互优化（FPS ≥ 55）
  - TanStack Query 缓存与离线回放，断网可浏览已缓存数据
  - Leaflet.draw + Turf 空间筛选，地图/列表/图表三端联动
  - PWA 瓦片缓存 + Docker + Nginx 一键部署
- 指标与结果：
  - 首屏 LCP 2.2s；主包 280KB gzip；CI 全绿；覆盖率 82%
- 演示脚本（60–90 秒）：登录 → 列表筛选 → 地图联动与圈选 → 聚合放大 → 仪表盘联动 → 离线访问 → 错误观测

## 依赖安装参考（WebGIS 专用，按需挑选）

以下命令为 PowerShell 版本；可按模块逐步引入，避免一次性装太多难以定位问题。

基础与核心

```powershell
# 基础框架与状态
npm i vue vue-router pinia

# 类型与工具
npm i -D typescript @types/node
```

地图与 GIS

```powershell
# Leaflet（推荐起步）
npm i leaflet
npm i -D @types/leaflet

# 常用插件（视需要逐个添加）
npm i leaflet.markercluster
npm i -D @types/leaflet.markercluster
npm i leaflet-draw
npm i -D @types/leaflet-draw
npm i leaflet-routing-machine
npm i leaflet.heat

# 可选：Mapbox GL JS（需要 token，3D/矢量瓦片）
npm i mapbox-gl
npm i -D @types/mapbox-gl

# 空间分析（缓冲区/点在多边形内/最近点等）
npm i @turf/turf

# 可选：投影/坐标系（GCJ-02/BD-09 或投影转换）
npm i proj4 proj4leaflet
npm i -D @types/proj4
```

数据获取、缓存与表单

```powershell
npm i axios @tanstack/vue-query

# 表单校验（2 选 1）
npm i vee-validate yup
# 或
npm i zod @vee-validate/zod
```

UI、图标与国际化

```powershell
npm i element-plus @element-plus/icons-vue

# 自动按需导入（减少样板代码）
npm i -D unplugin-auto-import unplugin-vue-components

# 可选：Tailwind CSS（需按官方步骤初始化）
# npm i -D tailwindcss postcss autoprefixer

# 国际化
npm i vue-i18n
```

可视化、实时与 PWA

```powershell
# 图表
npm i echarts

# 实时
npm i socket.io-client

# PWA 与构建分析
npm i -D vite-plugin-pwa rollup-plugin-visualizer
```

Mock、测试与质量

```powershell
# Mock 与测试
npm i -D msw vitest @vue/test-utils jsdom @testing-library/vue playwright

# 质量与规范
npm i -D eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  prettier eslint-config-prettier eslint-plugin-import lint-staged husky @commitlint/cli @commitlint/config-conventional
```

## 分阶段路线图（8 个冲刺｜ WebGIS 任务拆解）

### 冲刺 1：工程基线与应用壳

- 内容：TS 严格模式、目录与模块约定、RouteMeta 类型扩展、路由与基础布局（AppShell）、Pinia 初始 Store、伪登录与持久化、Element Plus 基础接入
- 交付：可运行的壳工程（登录/仪表盘/工单列表占位）、守卫雏形、主题与基础样式
- 类型要点：RouteMeta 声明合并、Pinia State/Getter/Action、全局类型与 env.d.ts 管理

### 冲刺 2：地图基线（Leaflet MapView）

- 内容：安装 Leaflet，引入样式，创建 `components/map/MapView.vue`；初始化地图、底图瓦片、缩放/比例尺控件；组合式 `useMap()` 封装
- 交付：`/dashboard` 渲染基础地图，可设置中心与缩放，窗口自适应
- 类型要点：Leaflet 类型（Map/TileLayer/Marker）、GeoJSON 类型（Feature/FeatureCollection）

### 冲刺 3：设施领域建模与 Mock API

- 内容：定义 Facility 领域模型（GeoJSON Point + 属性）、分页列表类型；MSW 编写 `/api/facilities` 列表/详情 Mock；`services/facilities.ts` 与 `stores/facilities.ts`
- 交付：`/workorders` 显示设施列表（加载/空/错误），分页与基本筛选
- 类型要点：DTO ⇄ VM 映射、分页类型 Page<T>、错误模型与 Result<T>

### 冲刺 4：地图标记与列表联动

- 内容：根据 Store 数据在 MapView 绘制 Marker；点击 Marker 弹出 Popup；点击列表高亮地图标记；URL Query 同步选中项
- 交付：列表与地图双向联动（选中/高亮/定位），Popup 展示关键信息
- 类型要点：事件类型（Leaflet LeafletMouseEvent）、选中态联合类型、路由 Query 序列化类型

### 冲刺 5：空间筛选（绘制 + Turf）

- 内容：接入 Leaflet.draw；支持矩形/多边形绘制；使用 Turf `booleanPointInPolygon` 与 `bbox` 做空间过滤；展示命中数量与统计
- 交付：可视化空间筛选（框选/圈选），列表与地图结果同步
- 类型要点：GeoJSON 多边形/线类型、空间算法入参类型、守护空数据与坐标精度

### 冲刺 6：聚合与性能优化

- 内容：Leaflet.markercluster 聚合大量标记；列表虚拟滚动（如 Vue Virtual Scroller 可选）；图层管理（基础/业务/绘制分层）
- 交付：5k+ 点位交互稳定，地图操作流畅；图层显隐可控
- 类型要点：聚合层类型、惰性加载、滚动容器尺寸与渲染边界

### 冲刺 7：路径规划与可视化联动

- 内容：Leaflet Routing Machine 规划两点或多点路径；在仪表盘加入 ECharts 图表（状态占比、区域分布）；与地图筛选联动
- 交付：可计算并展示路径；仪表盘与地图联动过滤
- 类型要点：路径点序列类型、图表数据类型化、组合式 `useEcharts()`

### 冲刺 8：实时与离线（PWA）

- 内容：socket.io 实时更新设施状态/位置（闪烁或高亮）；vite-plugin-pwa 缓存静态资源与瓦片（最近访问区域），新增版本更新提示
- 交付：在断网时可浏览已缓存区域地图与列表；联网后自动增量更新；实时数据秒级刷新
- 类型要点：WebSocket 事件类型、Service Worker 生命周期、缓存失效策略

## 目录结构建议（基于现有工程增量演进）

```

src/
api/ # 接口请求与实例封装
components/ # 共享基础组件
composables/ # 通用组合式函数（useXxx）
hooks/ # 业务级 hooks（可与 composables 合并）
layouts/ # 基础布局（AppShell、AuthLayout）
pages/ # 视图页面（按路由分）
router/ # 路由定义与守卫
stores/ # Pinia 仓库
services/ # 业务服务（DTO⇄VM、聚合 api）
types/ # 全局与领域模型类型
utils/ # 工具函数
assets/ # 样式与静态资源
i18n/ # 国际化资源（后期）
test/ # 测试辅助（后期）

```

## 统一约定（高效落地的关键）

- 严格 TS：开启 strict、exactOptionalPropertyTypes、noUncheckedIndexedAccess、noImplicitOverride 等
- 类型优先：API 请求/响应必须类型化；DTO 与 VM 分离
- 路由 meta 类型化：title、requiresAuth、roles?: string[]、keepAlive?: boolean
- Store 规范：State/Getter/Action 明确类型；持久化策略说明（localStorage/indexedDB）
- 错误与提示：统一错误模型与异常拦截，UI 提示与记录
- 表单：schema 与表单值绑定类型推断一致
- 组件：props/emits/slots 全类型；避免隐式 any

## 冲刺 1：实践任务（可执行）

> 目标：在当前 Vite + Vue + TS 工程上，完成工程基线与应用壳，打好类型基础。

### 任务 1：TypeScript 严格模式与类型基线

- tsconfig.json 建议：
  - strict = true
  - noImplicitAny = true
  - exactOptionalPropertyTypes = true
  - noUncheckedIndexedAccess = true
  - noFallthroughCasesInSwitch = true
  - useDefineForClassFields = true
- 在 env.d.ts（或 src/types/router.d.ts）扩展：
  - RouteMeta: { title: string; requiresAuth?: boolean; roles?: string[]; keepAlive?: boolean }
- ESLint 类型感知规则保持现状，如需增强在冲刺 2 处理

验收：

- 严格模式无错误；未显式类型会警告/报错
- 路由处能获得 route.meta.title 的 string 类型提示

### 任务 2：目录与模块约定落地

- 新增目录：`api/`、`services/`、`types/`、`utils/`、`composables/`、`layouts/`、`pages/`
- 在 `src/types/` 新增：
  - `common.ts`：Result<T>、Page<T>、ID 等
  - `auth.ts`：User、Role、AuthToken 等
- 在 `src/api/` 新增：
  - `http.ts`：预留 Axios 实例（本冲刺可空实现）
- 在 `src/layouts/` 新增：
  - `AppShell.vue`：基础三段式布局（Header/Sidebar/Main）

验收：

- 目录与文件创建完成，构建无报错
- `AppShell.vue` 被 `App.vue` 使用并渲染基础布局占位

### 任务 3：路由与布局接入

- 修改 `router/index.ts`：
  - 定义基础路由：`/login`、`/dashboard`、`/workorders`
  - 为每个路由设置 `meta.title`
- 在 `src/pages/` 新增：
  - `Login.vue`：静态登录表单（用户名/密码/按钮）
  - `Dashboard.vue`：显示“欢迎”
  - `Workorders.vue`：显示“工单列表占位”
- 在 `App.vue` 中：
  - 应用 `AppShell`，`<RouterView />` 渲染在主区域

验收：

- 三个路由可达；切页可在控制台看到 meta.title

### 任务 4：Pinia 初始化与伪登录流程

- 在 `stores/auth.ts`：
  - state：user: User | null，token: string | null
  - actions：login(username, password) → 固定凭据通过；setUser、setToken；持久化 localStorage
  - actions：logout() 清除并跳转 `/login`
- 在路由添加全局前置守卫：
  - 若 `meta.requiresAuth` 为 true 且无 token，重定向 `/login`
- `/dashboard` 与 `/workorders` 路由：`requiresAuth: true`

验收：

- `/login` 使用固定账号（如 admin/123456）可跳转 `/dashboard`
- 刷新后保持登录态（localStorage 恢复）
- 未登录访问受保护路由被重定向登录页

### 任务 5：基础可用性与体验

- Header 显示当前用户信息（若已登录）
- Sidebar 导航（Login/Dashboard/Workorders）
- 全局 loading/错误提示（先最简方案，后续再优化）

验收：

- 导航顺畅，登录状态清晰
- TypeCheck 通过，运行不报错

### 可选加分项

- 登录表单最简必填校验
- 抽出 `useAuth()` 可组合函数（`isAuthenticated`、`login/logout`）
- 在 `env.d.ts` 声明 `VITE_APP_NAME`，在标题中使用

## 推荐技术清单

- 基础：Vue 3、TypeScript、Vite、Pinia、Vue Router
- 工具：Axios、dayjs、lodash-es、@vueuse/core
- 表单：vee-validate + yup（或 zod）
- 测试：Vitest、@vue/test-utils、Playwright、MSW（或 json-server）
- 质量：ESLint、Prettier、Husky、lint-staged、commitlint、GitHub Actions（或本地 CI）
- UI：先自研基础组件；后期可选 Element Plus/Naive UI/Ant Design Vue
- 可选：echarts（图表）、mitt（事件总线）

## 后续冲刺预告

- 冲刺 2 将落地 Axios 实例、请求/响应拦截器、统一错误模型、全局异常处理、服务层与 Pinia 联动；用 Mock 数据驱动 Workorders 列表的真实异步加载与状态切换。

## 使用说明

- 本文档位于 `docs/learning-plan.zh-CN.md`，建议在每个冲刺开始前回顾“统一约定”与当期“验收”条目。
- 若团队规范与本文有出入，以团队现行规范为准，本文为练习与巩固主线。

```

```
