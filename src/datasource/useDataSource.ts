import { ref, watch, onUnmounted, type Ref } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'
import type { DataSource } from '@/stores/component'

/**
 * 从嵌套对象中根据路径获取值
 * 支持点号和数组索引，如: 'data.items[0].name'
 */
function getValueByPath(obj: unknown, path: string): unknown {
  if (!path) return obj

  try {
    // 处理路径如 'data.items[0].name'
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
    let result: unknown = obj

    for (const key of keys) {
      if (result === null || result === undefined) return undefined
      result = (result as Record<string, unknown>)[key]
    }

    return result
  } catch (error) {
    console.error('Path parsing error:', error)
    return undefined
  }
}

/**
 * 数据源 Hook
 * 支持 HTTP 请求和自动刷新
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

      // 根据数据路径提取数据
      if (ds.dataPath) {
        data.value = getValueByPath(response.data, ds.dataPath)
      } else {
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
