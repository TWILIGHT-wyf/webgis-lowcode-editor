// API 服务层类型定义（前端与后端交互）
// 注意：这里只定义 API 交互格式，完整业务类型请查看 @/types/page.ts

// 导出建议相关类型
export type {
  SuggestionRequest,
  SuggestionResult,
  DiffItem,
  WhitelistConfig,
  SuggestionItem,
  AuditRecord,
  SuggestionStatus,
} from './suggestion'

// 导出项目相关类型
export type { Project, ServerProject, ProjectInput, ProjectPage, CanvasSettings } from './page'
