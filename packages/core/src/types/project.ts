import { NodeSchema } from './schema'

/**
 * 页面配置接口
 */
export interface PageConfig {
  /** 页面布局模式: 'free' 自由布局(绝对定位) | 'flow' 流式布局(文档流) */
  layout: 'free' | 'flow'
}

export interface PageSchema {
  id: string
  name: string
  path: string
  /** 页面配置 */
  config?: PageConfig
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
