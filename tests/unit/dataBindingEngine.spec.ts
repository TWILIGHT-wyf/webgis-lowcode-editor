/**
 * 数据联动引擎单元测试
 * 覆盖：值同步、转换器、类型转换、循环保护、启停控制
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, reactive } from 'vue'
import type { Component } from '../../src/types/components'

// 直接引入运行时版本的数据联动引擎
import { useDataBindingEngine } from '../../src/runtime/useDataBindingEngine'

// 辅助函数：创建测试组件
function createComponent(partial: Partial<Component> & { id: string; type: string }): Component {
  return reactive({
    id: partial.id,
    type: partial.type,
    name: partial.name,
    position: partial.position ?? { x: 0, y: 0 },
    size: partial.size ?? { width: 100, height: 100 },
    rotation: partial.rotation ?? 0,
    zindex: partial.zindex ?? 0,
    style: partial.style ?? {},
    props: partial.props ?? {},
    dataSource: partial.dataSource,
    animation: partial.animation,
    groupId: partial.groupId,
    children: partial.children,
    layout: partial.layout,
    events: partial.events,
    dataBindings: partial.dataBindings,
  })
}

describe('数据联动引擎 (useDataBindingEngine)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('基础同步', () => {
    it('应将源属性值同步到目标属性', async () => {
      const source = createComponent({
        id: 'source-1',
        type: 'slider',
        props: { value: 50 },
      })

      const target = createComponent({
        id: 'target-1',
        type: 'Text',
        props: { text: '' },
        dataBindings: [
          {
            sourceId: 'source-1',
            sourcePath: 'props.value',
            targetPath: 'props.text',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      // 初始同步（immediate: true）
      expect(target.props.text).toBe('50') // 会转为字符串

      // 修改源值
      source.props.value = 100
      await nextTick()
      vi.runAllTimers()

      expect(target.props.text).toBe('100')

      engine.stop()
    })

    it('多个绑定应独立工作', async () => {
      const source1 = createComponent({
        id: 's1',
        type: 'slider',
        props: { value: 10 },
      })

      const source2 = createComponent({
        id: 's2',
        type: 'slider',
        props: { value: 20 },
      })

      const target = createComponent({
        id: 't1',
        type: 'stat',
        props: { title: '', value: 0 },
        dataBindings: [
          { sourceId: 's1', sourcePath: 'props.value', targetPath: 'props.title' },
          { sourceId: 's2', sourcePath: 'props.value', targetPath: 'props.value' },
        ],
      })

      const components = ref<Component[]>([source1, source2, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      expect(target.props.title).toBe(10) // 数值类型绑定保持原类型
      expect(target.props.value).toBe(20)

      engine.stop()
    })
  })

  describe('数据转换器', () => {
    it('表达式转换器应正确计算', async () => {
      const source = createComponent({
        id: 'src',
        type: 'slider',
        props: { value: 25 },
      })

      const target = createComponent({
        id: 'tgt',
        type: 'Text',
        props: { text: '' },
        dataBindings: [
          {
            sourceId: 'src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
            transformer: 'value * 4',
            transformerType: 'expression',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      expect(target.props.text).toBe('100') // 25 * 4 = 100，转字符串

      engine.stop()
    })

    it('模板转换器应正确替换占位符', async () => {
      const source = createComponent({
        id: 'temp-src',
        type: 'slider',
        props: { value: 36.5 },
      })

      const target = createComponent({
        id: 'temp-tgt',
        type: 'Text',
        props: { text: '' },
        dataBindings: [
          {
            sourceId: 'temp-src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
            transformer: '当前温度: ${value}℃',
            transformerType: 'template',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      expect(target.props.text).toBe('当前温度: 36.5℃')

      engine.stop()
    })

    it('复杂表达式转换器应正确执行', async () => {
      const source = createComponent({
        id: 'complex-src',
        type: 'slider',
        props: { value: 75 },
      })

      const target = createComponent({
        id: 'complex-tgt',
        type: 'Text',
        props: { text: '' },
        dataBindings: [
          {
            sourceId: 'complex-src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
            transformer: 'return value >= 60 ? "及格" : "不及格"',
            transformerType: 'expression',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      expect(target.props.text).toBe('及格')

      // 修改值测试不及格情况
      source.props.value = 50
      await nextTick()
      vi.runAllTimers()

      expect(target.props.text).toBe('不及格')

      engine.stop()
    })
  })

  describe('启停控制', () => {
    it('禁用引擎后不应同步数据', async () => {
      const source = createComponent({
        id: 'ctrl-src',
        type: 'slider',
        props: { value: 1 },
      })

      const target = createComponent({
        id: 'ctrl-tgt',
        type: 'Text',
        props: { text: '初始值' },
        dataBindings: [
          {
            sourceId: 'ctrl-src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      // 初始同步
      expect(target.props.text).toBe('1')

      // 禁用引擎
      engine.setEnabled(false)

      // 修改源值
      source.props.value = 999
      await nextTick()
      vi.runAllTimers()

      // 值不应更新
      expect(target.props.text).toBe('1')

      engine.stop()
    })

    it('停止引擎后 watch 应被清理', async () => {
      const source = createComponent({
        id: 'stop-src',
        type: 'slider',
        props: { value: 1 },
      })

      const target = createComponent({
        id: 'stop-tgt',
        type: 'Text',
        props: { text: '' },
        dataBindings: [
          {
            sourceId: 'stop-src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()
      expect(target.props.text).toBe('1')

      // 停止引擎
      engine.stop()

      // 修改源值
      source.props.value = 888
      await nextTick()
      vi.runAllTimers()

      // watch 已停止，值不更新
      expect(target.props.text).toBe('1')
    })
  })

  describe('边界情况', () => {
    it('无效绑定应被跳过', async () => {
      const target = createComponent({
        id: 'edge-tgt',
        type: 'Text',
        props: { text: '保持不变' },
        dataBindings: [
          // 缺少 sourceId
          { sourceId: '', sourcePath: 'props.value', targetPath: 'props.text' },
          // 源组件不存在
          { sourceId: 'not-exist', sourcePath: 'props.value', targetPath: 'props.text' },
        ],
      })

      const components = ref<Component[]>([target])
      const engine = useDataBindingEngine(components)

      // 不应抛出错误
      expect(() => engine.start()).not.toThrow()

      await nextTick()
      vi.runAllTimers()

      // 值保持不变
      expect(target.props.text).toBe('保持不变')

      engine.stop()
    })

    it('自环绑定应被忽略', async () => {
      const comp = createComponent({
        id: 'self-loop',
        type: 'stat',
        props: { value: 100 },
        dataBindings: [
          // 自己绑定自己
          { sourceId: 'self-loop', sourcePath: 'props.value', targetPath: 'props.value' },
        ],
      })

      const components = ref<Component[]>([comp])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      // 值保持不变，不会无限循环
      expect(comp.props.value).toBe(100)

      engine.stop()
    })

    it('相同值不应触发更新', async () => {
      const source = createComponent({
        id: 'same-src',
        type: 'slider',
        props: { value: 42 },
      })

      const target = createComponent({
        id: 'same-tgt',
        type: 'Text',
        props: { text: '42' }, // 已经是目标值
        dataBindings: [
          {
            sourceId: 'same-src',
            sourcePath: 'props.value',
            targetPath: 'props.text',
          },
        ],
      })

      const components = ref<Component[]>([source, target])
      const engine = useDataBindingEngine(components)
      engine.start()

      await nextTick()
      vi.runAllTimers()

      // 值相同，不应触发多余更新
      expect(target.props.text).toBe('42')

      engine.stop()
    })
  })
})
