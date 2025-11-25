/**
 * 建议面板 Pinia Store
 * 管理建议状态、历史记录、审计日志
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  SuggestionRequest,
  SuggestionResult,
  SuggestionItem,
  AuditRecord,
} from '@/type/suggestion'
import type { component as Component } from '@/stores/component'
import { generateSuggestion, applyDiffs } from '@/services/suggestService'
import { useComponent } from '@/stores/component'
import { nanoid } from 'nanoid'

export const useSuggestion = defineStore('suggestion', () => {
  // 状态
  const suggestions = ref<SuggestionItem[]>([])
  const auditRecords = ref<AuditRecord[]>([])
  const isGenerating = ref(false)
  const currentPreview = ref<SuggestionResult | null>(null)

  // 计算属性
  const pendingSuggestions = computed(() => suggestions.value.filter((s) => s.status === 'pending'))
  const acceptedCount = computed(
    () => suggestions.value.filter((s) => s.status === 'accepted').length,
  )
  const rejectedCount = computed(
    () => suggestions.value.filter((s) => s.status === 'rejected').length,
  )

  /**
   * 生成新建议
   */
  async function generate(prompt: string) {
    const componentStore = useComponent()

    isGenerating.value = true
    try {
      const request: SuggestionRequest = {
        prompt,
        context: {
          components: componentStore.componentStore as Component[],
          canvasSize: {
            width: 1920,
            height: 1080,
          },
        },
        timestamp: Date.now(),
      }

      const result = await generateSuggestion(request)

      const item: SuggestionItem = {
        result,
        status: 'pending',
        createdAt: Date.now(),
      }

      suggestions.value.unshift(item)
      return result
    } catch (error) {
      console.error('[SuggestionStore] 生成建议失败:', error)
      throw error
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * 预览建议
   */
  function preview(suggestionId: string) {
    const item = suggestions.value.find((s) => s.result.id === suggestionId)
    if (item) {
      currentPreview.value = item.result
      item.status = 'previewing'
    }
  }

  /**
   * 取消预览
   */
  function cancelPreview() {
    if (currentPreview.value) {
      const item = suggestions.value.find((s) => s.result.id === currentPreview.value?.id)
      if (item) {
        item.status = 'pending'
      }
    }
    currentPreview.value = null
  }

  /**
   * 接受建议（全部）
   */
  function accept(suggestionId: string) {
    const componentStore = useComponent()
    const item = suggestions.value.find((s) => s.result.id === suggestionId)
    if (!item) return

    const beforeSnapshot = [...(componentStore.componentStore as Component[])]

    // 应用所有差异
    const { components: newComponents, appliedCount } = applyDiffs(
      componentStore.componentStore as Component[],
      item.result.diffs,
    )

    if (appliedCount > 0) {
      componentStore.componentStore = newComponents

      // 记录审计日志
      const audit: AuditRecord = {
        id: nanoid(),
        suggestionId: item.result.id,
        prompt: item.result.request.prompt,
        action: 'accepted',
        appliedDiffs: item.result.diffs.map((d) => d.description),
        agentVersion: item.result.agentVersion,
        changeSummary: `应用了 ${appliedCount} 个变更`,
        beforeSnapshot,
        afterSnapshot: [...newComponents],
        timestamp: Date.now(),
      }
      auditRecords.value.unshift(audit)

      item.status = 'accepted'
      currentPreview.value = null
    }
  }

  /**
   * 部分接受建议
   */
  function acceptPartial(suggestionId: string, diffIndices: number[]) {
    const componentStore = useComponent()
    const item = suggestions.value.find((s) => s.result.id === suggestionId)
    if (!item) return

    const beforeSnapshot = [...(componentStore.componentStore as Component[])]

    // 筛选要应用的差异
    const selectedDiffs = item.result.diffs.filter((_, index) => diffIndices.includes(index))

    const { components: newComponents, appliedCount } = applyDiffs(
      componentStore.componentStore as Component[],
      selectedDiffs,
    )

    if (appliedCount > 0) {
      componentStore.componentStore = newComponents

      // 记录审计日志
      const audit: AuditRecord = {
        id: nanoid(),
        suggestionId: item.result.id,
        prompt: item.result.request.prompt,
        action: 'partial',
        appliedDiffs: selectedDiffs.map((d) => d.description),
        agentVersion: item.result.agentVersion,
        changeSummary: `应用了 ${appliedCount}/${item.result.diffs.length} 个变更`,
        beforeSnapshot,
        afterSnapshot: [...newComponents],
        timestamp: Date.now(),
      }
      auditRecords.value.unshift(audit)

      item.status = 'accepted'
      currentPreview.value = null
    }
  }

  /**
   * 拒绝建议
   */
  function reject(suggestionId: string, note?: string) {
    const item = suggestions.value.find((s) => s.result.id === suggestionId)
    if (!item) return

    // 记录审计日志
    const audit: AuditRecord = {
      id: nanoid(),
      suggestionId: item.result.id,
      prompt: item.result.request.prompt,
      action: 'rejected',
      agentVersion: item.result.agentVersion,
      changeSummary: '用户拒绝了此建议',
      beforeSnapshot: [],
      timestamp: Date.now(),
      note,
    }
    auditRecords.value.unshift(audit)

    item.status = 'rejected'
    currentPreview.value = null
  }

  /**
   * 回滚到指定审计记录
   */
  function rollback(auditId: string) {
    const componentStore = useComponent()
    const audit = auditRecords.value.find((a) => a.id === auditId)
    if (!audit || !audit.beforeSnapshot) return

    const beforeRollback = [...(componentStore.componentStore as Component[])]

    // 恢复快照
    componentStore.componentStore = [...audit.beforeSnapshot]

    // 记录回滚操作
    const rollbackAudit: AuditRecord = {
      id: nanoid(),
      suggestionId: audit.suggestionId,
      prompt: `回滚: ${audit.prompt}`,
      action: 'rollback',
      agentVersion: audit.agentVersion,
      changeSummary: `回滚到 ${new Date(audit.timestamp).toLocaleString()} 的状态`,
      beforeSnapshot: beforeRollback,
      afterSnapshot: [...audit.beforeSnapshot],
      timestamp: Date.now(),
    }
    auditRecords.value.unshift(rollbackAudit)
  }

  /**
   * 清空建议历史
   */
  function clearSuggestions() {
    suggestions.value = []
    currentPreview.value = null
  }

  /**
   * 导出审计日志
   */
  function exportAudit(): string {
    const data = {
      exportTime: new Date().toISOString(),
      totalRecords: auditRecords.value.length,
      records: auditRecords.value.map((r) => ({
        id: r.id,
        prompt: r.prompt,
        action: r.action,
        changeSummary: r.changeSummary,
        timestamp: new Date(r.timestamp).toISOString(),
        note: r.note,
      })),
    }
    return JSON.stringify(data, null, 2)
  }

  return {
    // 状态
    suggestions,
    auditRecords,
    isGenerating,
    currentPreview,

    // 计算属性
    pendingSuggestions,
    acceptedCount,
    rejectedCount,

    // 方法
    generate,
    preview,
    cancelPreview,
    accept,
    acceptPartial,
    reject,
    rollback,
    clearSuggestions,
    exportAudit,
  }
})
