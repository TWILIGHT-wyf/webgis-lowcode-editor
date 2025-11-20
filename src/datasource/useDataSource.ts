import { ref, watch, onUnmounted, type Ref } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import type { DataSource } from '@/stores/component'

/**
 * 数据源 Hook
 * 支持 HTTP 请求和自动刷新
 *
 * 注意：此 Hook 始终返回完整的响应数据
 * 由各个组件使用 chartUtils 中的工具函数自行提取所需数据
 */
export function useDataSource(dataSource: Ref<DataSource | undefined>) {
  const data = ref<unknown>(null)
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

      // 对于图表类型（有多个路径配置或存在 dataPath），返回完整响应数据
      // 让组件自己根据 dataPath、xAxisPath、labelsPath 等提取数据
      // 这样确保图表组件始终能正确提取嵌套数据
      if (
        ds.dataPath ||
        ds.xAxisPath ||
        ds.seriesNamePath ||
        ds.labelsPath ||
        ds.seriesNamesPath ||
        ds.seriesDataPath
      ) {
        data.value = response.data
      } else {
        // 如果没有任何路径配置，直接返回完整响应
        data.value = response.data
      }

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
    data,
    loading,
    error,
    fetchData, // 手动刷新
  }
}
