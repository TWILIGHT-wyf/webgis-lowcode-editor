import type { Component } from '@/types/components'

export interface PageTemplate {
  id: string
  name: string
  description: string
  preview: string // 预览图URL
  category: 'dashboard' | 'gis' | 'form' | 'chart' | 'other'
  components: Component[]
}

export interface PageConfig {
  id: string
  name: string
  components: Component[] // 存储该页面的组件树
  canvasConfig: {
    width: number
    height: number
    backgroundColor: string
  }
  thumbnail?: string
}
