import { describe, it, expect } from 'vitest'
import { generateVueCode } from '@/utils/toCode'
import type { Component } from '@/types/components'

describe('toCode.generateVueCode', () => {
  it('包含从 @twi1i9ht/visual-lib 的导入并使用单引号绑定 props', () => {
    const comps: Component[] = [
      {
        id: 'txt-1',
        type: 'Text',
        name: 'Text1',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 30 },
        rotation: 0,
        zindex: 1,
        style: { visible: true },
        props: { text: 'Hello', title: 'Hello' },
      },
    ]

    const code = generateVueCode(comps)

    // 断言：导入来自新的组件库包名
    expect(code).toContain("from '@twi1i9ht/visual-lib'")
    // 断言：props 使用单引号包裹 JSON 字符串，如 :title='"Hello"'
    expect(code).toContain(`:title='"Hello"'`)

    // 快照测试（便于捕获未来变更）
    expect(code).toMatchSnapshot()
  })

  it('正确生成嵌套结构：vMap 包含 vMarker', () => {
    const map: Component = {
      id: 'map-1',
      type: 'map',
      name: 'Map',
      position: { x: 0, y: 0 },
      size: { width: 600, height: 400 },
      rotation: 0,
      zindex: 1,
      style: { visible: true },
      props: {},
    }

    const marker: Component = {
      id: 'marker-1',
      type: 'marker',
      name: 'Marker',
      position: { x: 10, y: 10 },
      size: { width: 20, height: 20 },
      rotation: 0,
      zindex: 2,
      style: { visible: true },
      props: { label: 'M' },
      groupId: 'map-1',
    }

    const code = generateVueCode([map, marker])

    // 应包含 vMap 标签与 vMarker 子节点
    expect(code).toContain('<vMap')
    expect(code).toContain('<vMarker')

    // 导入应包含 vMap 和 vMarker
    expect(code).toContain('vMap')
    expect(code).toContain('vMarker')

    expect(code).toMatchSnapshot()
  })
})
