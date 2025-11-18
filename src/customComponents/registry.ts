import type { Component } from "vue";
import Text from "./text/Text.vue";

export const componentRegistry: Record<string, Component> = {
  'Text': Text
}

export function getComponent(type:string){
  return componentRegistry[type] || 'div'
}
