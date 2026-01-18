/**
 * Page-related types
 * Re-exports from project.ts with additional template types
 */

export type { PageSchema, PageConfig, ProjectSchema } from './project'

import type { Component } from './components'

/**
 * Page template for predefined layouts
 */
export interface PageTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: 'dashboard' | 'gis' | 'form' | 'chart' | 'other'
  components: Component[]
}
