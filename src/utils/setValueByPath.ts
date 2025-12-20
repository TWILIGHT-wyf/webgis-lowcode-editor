// 设置对象路径上的值（支持 a.b.c 与 a[0].b 语法）
// 仅用于运行时数据联动（DataBinding）写入目标路径

function tokenize(path: string): Array<string | number> {
  const tokens: Array<string | number> = []
  const normalized = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean)

  for (const seg of normalized) {
    if (/^\d+$/.test(seg)) tokens.push(Number(seg))
    else tokens.push(seg)
  }
  return tokens
}

export function setValueByPath(obj: unknown, path: string, value: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false
  if (!path) return false

  const tokens = tokenize(path)
  if (tokens.length === 0) return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj

  for (let i = 0; i < tokens.length - 1; i++) {
    const key = String(tokens[i])
    const nextKey = tokens[i + 1]

    if (cur[key] == null || typeof cur[key] !== 'object') {
      // 需要创建中间容器
      cur[key] = typeof nextKey === 'number' ? [] : {}
    }
    cur = cur[key]
  }

  const last = String(tokens[tokens.length - 1])
  cur[last] = value
  return true
}
