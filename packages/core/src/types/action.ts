import { JSExpression } from './expression'

export interface BaseAction {
  id: string
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

export interface AlertAction extends BaseAction {
  type: 'alert'
  message: string
}

export interface CustomScriptAction extends BaseAction {
  type: 'customScript'
  content: string
}

export type ActionSchema =
  | OpenUrlAction
  | NavigateAction
  | UpdateStateAction
  | AlertAction
  | CustomScriptAction
  | BaseAction
