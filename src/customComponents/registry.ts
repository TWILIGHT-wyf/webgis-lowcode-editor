import type { Component } from 'vue'
import Text from './text/Text.vue'
import Group from './group/Group.vue'

export const componentRegistry: Record<string, Component> = {
  Text: Text,
  Group: Group,
}

export function getComponent(type: string) {
  return componentRegistry[type] || 'div'
}
