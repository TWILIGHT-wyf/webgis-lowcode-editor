import { ref, watch, onUnmounted, type Ref } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import type { DataSource } from '@/stores/component'

/**
 * 数据源 Hook
 * 支持 HTTP 请求和自动刷新
 *
 * 职责：仅负责网络请求，返回完整响应数据
 * 数据提取：由各组件使用 dataUtils 工具函数自行提取所需字段
 * 优势：组件可灵活提取多个字段，互不影响
 */
export function useDataSource(dataSource: Ref<DataSource | undefined>) {
  const data = ref<unknown>(null)
  const rawData = ref<unknown>(null) // 完整响应数据
  const loading = ref(false)
  const error = ref<string | null>(null)
  let intervalId: number | null = null

  /**
   * 执行数据请求
   */
  const fetchData = async () => {
    const ds = dataSource.value
    if (!ds || !ds.enabled || !ds.url) {
      return
    }

    loading.value = true
    error.value = null

    try {
      // 构建请求配置
      const config: AxiosRequestConfig = {
        method: ds.method || 'GET',
        url: ds.url,
        headers: ds.headers || {},
      }

      // 处理请求体（仅 POST/PUT/DELETE）
      if (['POST', 'PUT', 'DELETE'].includes(ds.method) && ds.body) {
        try {
          config.data = JSON.parse(ds.body)
        } catch {
          error.value = '请求体 JSON 格式错误'
          loading.value = false
          return
        }
      }

      // 发送请求
      const response = await axios(config)

      // 保存完整响应数据
      // 不做任何数据提取，由各组件使用 dataUtils 工具函数自行提取
      // 这样每个组件可以灵活提取所需的多个字段
      rawData.value = response.data
      data.value = response.data
      error.value = null
    } catch (err: unknown) {
      error.value = (err as Error).message || '请求失败'
      console.error('Data source fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 启动定时刷新
   */
  const startPolling = () => {
    stopPolling()
    const ds = dataSource.value
    if (ds && ds.enabled && ds.interval && ds.interval > 0) {
      // interval 单位为秒，转换为毫秒
      intervalId = window.setInterval(fetchData, ds.interval * 1000)
    }
  }

  /**
   * 停止定时刷新
   */
  const stopPolling = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // 监听 dataSource 变化
  watch(
    () => dataSource.value,
    (newDs) => {
      stopPolling()
      if (newDs && newDs.enabled && newDs.url) {
        fetchData()
        startPolling()
      } else {
        data.value = null
      }
    },
    { immediate: true, deep: true },
  )

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopPolling()
  })

  return {
    data, // 提取后的数据（根据 valuePath/dataPath）
    rawData, // 完整响应数据（供图表组件使用）
    loading,
    error,
    fetchData, // 手动刷新
  }
}
