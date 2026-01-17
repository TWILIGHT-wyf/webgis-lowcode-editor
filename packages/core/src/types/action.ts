import { JSExpression } from './expression'

export interface BaseAction {
  type: string
  condition?: boolean | JSExpression
  delay?: number
}

export interface OpenUrlAction extends BaseAction {
  type: 'openUrl'
  url: string
  blank?: boolean
}

export interface NavigateAction extends BaseAction {
  type: 'navigate'
  path: string
}

export interface UpdateStateAction extends BaseAction {
  type: 'updateState'
  stateName: string
  value: any
}

export type ActionSchema = OpenUrlAction | NavigateAction | UpdateStateAction | BaseAction
