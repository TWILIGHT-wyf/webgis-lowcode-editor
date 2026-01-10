import type { Component } from './components'

// 页面树节点类型（仅前端使用，用于导航）
export interface PageTreeNode {
  id: string
  name: string
  type: 'page' | 'folder'
  children?: PageTreeNode[]
  expanded?: boolean
  path?: string
  isHome?: boolean
}

// 画布设置
export interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  gridEnabled?: boolean
  snapEnabled?: boolean
}

// 项目中的页面数据（数据库存储格式）
export interface ProjectPage {
  id: string
  name: string
  route?: string
  thumbnail?: string
  components: Component[]
  canvasSettings?: CanvasSettings
}

// 项目数据结构（前端业务层使用）
export interface Project {
  id?: string
  name: string
  cover?: string
  description?: string
  category?: string
  pages: ProjectPage[]
  createdAt?: string
  updatedAt?: string
}

// 服务器返回的项目格式（MongoDB _id）
export interface ServerProject {
  _id: string
  name: string
  cover?: string
  description?: string
  category?: string
  pages: ProjectPage[]
  createdAt: string
  updatedAt: string
}

// 项目创建/更新输入参数
export interface ProjectInput {
  name: string
  description?: string
  category?: string
  pages?: ProjectPage[]
}

// 页面模板（用于快速创建页面）
export interface PageTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: 'dashboard' | 'gis' | 'form' | 'chart' | 'other'
  components: Component[]
}

// 页面配置（已废弃，使用 ProjectPage 代替）
/** @deprecated Use ProjectPage instead */
export interface PageConfig {
  id: string
  name: string
  components: Component[]
  canvasConfig: {
    width: number
    height: number
    backgroundColor: string
  }
  thumbnail?: string
}
