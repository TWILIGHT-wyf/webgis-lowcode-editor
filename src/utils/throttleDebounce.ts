/**
 * 节流函数：确保函数在指定时间内最多执行一次
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T> | void {
  let lastCall = 0
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | void {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func.apply(this, args) as ReturnType<T>
    }
  }
}

/**
 * 防抖函数：延迟执行函数，如果在延迟时间内再次调用，则重新计时
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(context, args), delay)
  }
}
