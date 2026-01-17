import { NodeSchema } from './schema'

export interface PageSchema {
  id: string
  name: string
  path: string
  children: NodeSchema // 页面根节点 (通常是一个名为 'Page' 的容器)
}

export interface ProjectSchema {
  version: string
  name: string
  description?: string
  config: {
    layout: 'mobile' | 'pc'
    theme: string
  }
  // 多页面定义
  pages: PageSchema[]
}
