import { watch, type Ref, type WatchStopHandle } from 'vue'
import { get, set, isEqual } from 'lodash-es'
import type { Component, DataBinding } from '../../types/components'

export interface DataBindingEngine {
  start: () => void
  stop: () => void
}

/**
 * 归一化组件的数据绑定配置
 */
function normalizeBindings(comp: Component): DataBinding[] {
  return Array.isArray(comp.dataBindings) ? comp.dataBindings : []
}

/**
 * 数据联动引擎
 *
 * 核心特性：
 * 1. 使用 lodash get/set 安全处理深层属性路径
 * 2. 使用 Map 索引优化查找性能 O(1)
 * 3. 使用锁机制防止循环绑定导致的无限更新
 * 4. 支持数据转换器（表达式/模板）
 * 5. 精确路径监听，避免不必要的 deep watch
 */
export function useDataBindingEngine(components: Ref<Component[]>): DataBindingEngine {
  let stops: WatchStopHandle[] = []
  // 更新锁：防止 A→B→A 循环绑定导致无限递归
  const updateLocks = new Set<string>()

  function stop() {
    for (const stopFn of stops) stopFn()
    stops = []
    updateLocks.clear()
  }

  function start() {
    stop()

    const comps = components.value
    if (!Array.isArray(comps) || comps.length === 0) return

    // 使用 Map 建立组件索引，O(1) 查找复杂度
    const compById = new Map(comps.map((c) => [c.id, c] as const))

    for (const target of comps) {
      const bindings = normalizeBindings(target)
      if (bindings.length === 0) continue

      for (const binding of bindings) {
        if (!binding?.sourceId || !binding.sourcePath || !binding.targetPath) continue

        // 自环保护：同组件同路径跳过
        if (
          binding.sourceId === target.id &&
          (binding.sourcePath === binding.targetPath ||
            binding.targetPath.startsWith(`${binding.sourcePath}.`) ||
            binding.sourcePath.startsWith(`${binding.targetPath}.`))
        ) {
          continue
        }

        const source = compById.get(binding.sourceId)
        if (!source) continue

        /**
         * 核心更新函数：读取源值 → 转换 → 写入目标
         */
        const doUpdate = (sourceValue: unknown) => {
          // 生成锁标识符：targetId:targetPath
          const lockKey = `${target.id}:${binding.targetPath}`

          // 如果当前路径正在更新中，跳过（防止循环）
          if (updateLocks.has(lockKey)) {
            return
          }

          const latestTarget = compById.get(target.id)
          if (!latestTarget) return

          try {
            // 上锁
            updateLocks.add(lockKey)

            // 执行数据转换器
            let finalValue = sourceValue
            if (binding.transformer) {
              try {
                if (binding.transformerType === 'template') {
                  // 模板字符串：当前温度: ${value}℃
                  finalValue = binding.transformer.replace(/\$\{value\}/g, String(sourceValue))
                } else {
                  // JavaScript 表达式
                  const code = binding.transformer.trim()
                  const fn = code.startsWith('return ')
                    ? new Function('value', code)
                    : new Function('value', `return ${code}`)
                  finalValue = fn(sourceValue)
                }
              } catch (error) {
                console.error('[DataLinkage] 转换器执行失败:', {
                  transformer: binding.transformer,
                  error,
                })
                // 转换失败使用原值
              }
            }

            // 使用 lodash get 读取当前目标值
            const currentValue = get(latestTarget, binding.targetPath)

            // 值未变化则跳过（避免触发不必要的响应式更新）
            if (isEqual(currentValue, finalValue)) {
              return
            }

            // 使用 lodash set 安全写入深层属性
            set(latestTarget, binding.targetPath, finalValue)

            console.log('[DataLinkage] 数据联动生效:', {
              source: `${binding.sourceId}:${binding.sourcePath}`,
              target: `${target.id}:${binding.targetPath}`,
              value: finalValue,
            })
          } finally {
            // 解锁（使用 setTimeout 确保同步更新链完成后再解锁）
            setTimeout(() => {
              updateLocks.delete(lockKey)
            }, 0)
          }
        }

        // 初始同步：立即执行一次绑定
        try {
          const initialValue = get(source, binding.sourcePath)
          doUpdate(initialValue)
        } catch (error) {
          console.warn('[DataLinkage] 初始同步失败:', {
            source: `${binding.sourceId}:${binding.sourcePath}`,
            error,
          })
        }

        // 使用 watch 监听源组件的指定路径
        // 只监听计算结果，而非整个组件对象，避免不必要的 deep watch
        const stopWatch = watch(
          () => {
            const sourceComp = compById.get(binding.sourceId)
            if (!sourceComp) return undefined
            return get(sourceComp, binding.sourcePath)
          },
          (newValue) => {
            doUpdate(newValue)
          },
          {
            deep: true, // 保留 deep 以监听对象/数组内部变化
            immediate: false, // 不需要 immediate，因为已经做了初始同步
          },
        )

        stops.push(stopWatch)
      }
    }
  }

  // 监听组件数组引用变化（如切换页面），自动重建引擎
  watch(
    components,
    () => {
      start()
    },
    { deep: false },
  )

  return { start, stop }
}
