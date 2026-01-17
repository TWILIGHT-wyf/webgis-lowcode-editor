/**
 * 数据提取工具函数（通用）
 * 用于所有组件的数据源、路径解析、数据格式化等
 * 图表、KPI、Text 等组件都使用这些工具函数提取数据
 */

/**
 * 从对象中根据路径提取值
 * 支持点号路径和数组索引，如: "data.chart.values" 或 "items[0].name"
 *
 * @param obj - 源数据对象
 * @param path - 提取路径，可选（为空则返回 undefined）
 * @returns 提取的值，或 undefined
 */
export function getValueByPath(obj: unknown, path: string | undefined): unknown {
  if (!path || !obj) return undefined
  try {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')
    let result: unknown = obj
    for (const key of keys) {
      if (result === null || result === undefined) return undefined
      result = (result as Record<string, unknown>)[key]
    }
    return result
  } catch {
    return undefined
  }
}

/**
 * 从数据源提取单个数值
 * 用于 KPI 组件（countUp, progress, badge 等）
 *
 * @param remoteData - 远程数据对象
 * @param valuePath - 数值路径，可选
 * @param defaultValue - 默认值
 * @returns 提取的数值
 */
export function extractNumber(
  remoteData: unknown,
  valuePath: string | undefined,
  defaultValue: number = 0,
): number {
  if (!valuePath) return defaultValue

  const value = getValueByPath(remoteData, valuePath)
  if (typeof value === 'number') return value
  if (value !== undefined && value !== null) {
    const parsed = parseFloat(String(value))
    return isNaN(parsed) ? defaultValue : parsed
  }

  return defaultValue
}

/**
 * 解析逗号分隔的数字输入
 * 支持 JSON 数组格式和逗号分隔格式
 * @param input - 输入字符串，如 "150, 230, 224" 或 "[150, 230, 224]"
 * @param defaultValue - 默认值数组
 */
export function parseNumberInput(input: string | undefined, defaultValue: number[] = []): number[] {
  if (!input) return defaultValue

  // 尝试 JSON 解析
  try {
    const parsed = JSON.parse(input)
    if (Array.isArray(parsed)) {
      return parsed
        .map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
        .filter((v) => !isNaN(v))
    }
  } catch {
    // JSON 解析失败，尝试逗号分隔
  }

  // 逗号分隔解析
  return input
    .split(',')
    .map((v) => parseFloat(v.trim()))
    .filter((v) => !isNaN(v))
}

/**
 * 解析逗号分隔的字符串输入
 * 支持 JSON 数组格式和逗号分隔格式
 * @param input - 输入字符串，如 "Mon, Tue, Wed" 或 '["Mon", "Tue", "Wed"]'
 * @param defaultValue - 默认值数组
 */
export function parseStringInput(input: string | undefined, defaultValue: string[] = []): string[] {
  if (!input) return defaultValue

  // 尝试 JSON 解析
  try {
    const parsed = JSON.parse(input)
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v))
    }
  } catch {
    // JSON 解析失败，尝试逗号分隔
  }

  // 逗号分隔解析
  return input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

/**
 * 解析二维数组输入（用于散点图等）
 * @param input - 输入字符串，如 "[[10, 8], [8, 7]]"
 * @param defaultValue - 默认值数组
 */
export function parse2DArrayInput(
  input: string | undefined,
  defaultValue: Array<[number, number]> = [],
): Array<[number, number]> {
  if (!input) return defaultValue

  try {
    const parsed = JSON.parse(input)
    if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
      return parsed.map((item) => {
        if (Array.isArray(item) && item.length >= 2) {
          return [
            typeof item[0] === 'number' ? item[0] : parseFloat(String(item[0])),
            typeof item[1] === 'number' ? item[1] : parseFloat(String(item[1])),
          ] as [number, number]
        }
        return [0, 0] as [number, number]
      })
    }
  } catch {
    // JSON 解析失败
  }

  return defaultValue
}

/**
 * 从数据源提取数字数组
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extractNumberArray(
  remoteData: unknown,
  dataPath: string | undefined,
): number[] | undefined {
  if (!dataPath) return undefined

  const extractedData = getValueByPath(remoteData, dataPath)
  if (Array.isArray(extractedData)) {
    return extractedData.map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
  }

  return undefined
}

/**
 * 从数据源提取字符串数组
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extractStringArray(
  remoteData: unknown,
  dataPath: string | undefined,
): string[] | undefined {
  if (!dataPath) return undefined

  const extractedData = getValueByPath(remoteData, dataPath)
  if (Array.isArray(extractedData)) {
    return extractedData.map((v) => String(v))
  }

  return undefined
}

/**
 * 从数据源提取二维数组（用于散点图等）
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extract2DArray(
  remoteData: unknown,
  dataPath: string | undefined,
): Array<[number, number]> | undefined {
  if (!dataPath) return undefined

  const extractedData = getValueByPath(remoteData, dataPath)
  if (Array.isArray(extractedData) && extractedData.length > 0 && Array.isArray(extractedData[0])) {
    return extractedData.map((item) => {
      if (Array.isArray(item) && item.length >= 2) {
        return [
          typeof item[0] === 'number' ? item[0] : parseFloat(String(item[0])),
          typeof item[1] === 'number' ? item[1] : parseFloat(String(item[1])),
        ] as [number, number]
      }
      return [0, 0] as [number, number]
    })
  }

  return undefined
}

/**
 * 从数据源提取字符串值
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extractString(
  remoteData: unknown,
  dataPath: string | undefined,
): string | undefined {
  if (!dataPath) return undefined

  const extractedData = getValueByPath(remoteData, dataPath)
  return extractedData ? String(extractedData) : undefined
}

/**
 * 解析 JSON 数组输入（通用）
 * @param input - JSON 字符串输入
 * @param defaultValue - 默认值
 */
export function parseJSONInput<T = unknown>(input: string | undefined, defaultValue: T): T {
  if (!input) return defaultValue

  try {
    const parsed = JSON.parse(input)
    return parsed as T
  } catch (e) {
    console.error('Failed to parse JSON input:', e)
    return defaultValue
  }
}

/**
 * 提取并规范化 Sankey 图节点数据
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extractSankeyNodes(
  remoteData: unknown,
  dataPath: string | undefined,
): Array<{ name: string; value?: number; depth?: number; itemStyle?: unknown }> | undefined {
  if (!dataPath) return undefined

  const nodesData = getValueByPath(remoteData, dataPath)
  if (!Array.isArray(nodesData) || nodesData.length === 0) return undefined

  return nodesData.map((node: unknown) => {
    const obj =
      typeof node === 'object' && node !== null ? (node as Record<string, unknown>) : undefined
    const name = typeof node === 'string' ? node : String(obj?.name ?? obj?.id ?? '')

    return {
      name,
      value:
        obj && typeof obj.value === 'number'
          ? (obj.value as number)
          : obj && obj.value != null
            ? parseFloat(String(obj.value))
            : undefined,
      depth:
        obj && typeof obj.depth === 'number'
          ? (obj.depth as number)
          : obj && obj.depth != null
            ? parseFloat(String(obj.depth))
            : undefined,
      itemStyle: obj ? obj.itemStyle : undefined,
    }
  })
}

/**
 * 提取并规范化 Sankey 图连接数据
 * @param remoteData - 远程数据对象
 * @param dataPath - 数据路径
 */
export function extractSankeyLinks(
  remoteData: unknown,
  dataPath: string | undefined,
): Array<{ source: string; target: string; value: number }> | undefined {
  if (!dataPath) return undefined

  const linksData = getValueByPath(remoteData, dataPath)
  if (!Array.isArray(linksData) || linksData.length === 0) return undefined

  return linksData.map((link: unknown) => {
    const l = link as Record<string, unknown>
    return {
      source: (l.source || l.from || '') as string,
      target: (l.target || l.to || '') as string,
      value: (l.value || 0) as number,
    }
  })
}

/**
 * KPI 组件专用：提取多个字段的数据
 * 用于 stat 组件等需要同时提取多个字段的场景
 *
 * @param remoteData - 远程数据对象
 * @param paths - 字段路径映射 { title: 'data.title', value: 'data.value', ... }
 * @returns 提取的数据对象
 *
 * @example
 * const data = extractMultipleFields(remoteData, {
 *   title: 'data.kpi.title',
 *   value: 'data.kpi.value',
 *   change: 'data.kpi.change'
 * })
 * // 返回: { title: '销售额', value: 12345, change: 5.2 }
 */
export function extractMultipleFields<T extends Record<string, string | undefined>>(
  remoteData: unknown,
  paths: T,
): Record<keyof T, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, path] of Object.entries(paths)) {
    if (path && typeof path === 'string') {
      result[key] = getValueByPath(remoteData, path)
    }
  }

  return result as Record<keyof T, unknown>
}

/**
 * 智能提取数据：优先使用路径提取，否则使用默认值
 * 用于所有简单组件（text, countUp, progress, badge 等）
 *
 * @param remoteData - 远程数据对象
 * @param path - 数据路径
 * @param fallbackValue - 回退值（当路径未配置或提取失败时使用）
 * @returns 提取的数据或回退值
 */
export function extractWithFallback<T>(
  remoteData: unknown,
  path: string | undefined,
  fallbackValue: T,
): T {
  if (!path) return fallbackValue

  const extracted = getValueByPath(remoteData, path)
  return (extracted ?? fallbackValue) as T
}
