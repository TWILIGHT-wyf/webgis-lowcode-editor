// Lightweight re-exports so existing imports like '@/datasource/useDataSource' work
// This forwards requested hooks/utilities from the component library package

export {
  useDataSource,
  getValueByPath,
  setValueByPath,
  extractWithFallback,
} from '@vela/ui'
