<template>
  <div class="props-pane">
    <el-empty v-if="!node" description="请选择一个组件" :image-size="80">
      <template #image>
        <el-icon :size="64"><Select /></el-icon>
      </template>
    </el-empty>

    <el-form v-else label-position="top" size="default" class="props-form">
      <div class="component-info">
        <el-tag type="info" size="small">{{ node.componentName }}</el-tag>
      </div>

      <template v-for="prop in metaProps" :key="prop.name">
        <el-form-item :label="prop.title || prop.name">
          <component
            :is="getSetterComponent(prop.setter)"
            v-model="(node.props as any)[prop.name]"
            v-bind="prop.setterProps || {}"
          />
          <div v-if="prop.description" class="prop-description">
            {{ prop.description }}
          </div>
        </el-form-item>
      </template>

      <el-empty
        v-if="metaProps.length === 0"
        description="此组件没有可配置的属性"
        :image-size="60"
      />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import type { NodeSchema } from '@vela/core'
import { materialList } from '@vela/materials'
import { Select } from '@element-plus/icons-vue'

// 导入所有 Setters
import StringSetter from '../setters/StringSetter.vue'
import NumberSetter from '../setters/NumberSetter.vue'
import SelectSetter from '../setters/SelectSetter.vue'
import ColorSetter from '../setters/ColorSetter.vue'
import BooleanSetter from '../setters/BooleanSetter.vue'

interface Props {
  node?: NodeSchema | null
}

const props = defineProps<Props>()

// 获取当前组件的 Meta 定义
const metaProps = computed(() => {
  if (!props.node) return []
  const meta = materialList.find((m) => m.componentName === props.node!.componentName)
  return meta?.props || []
})

// 映射 Setter 字符串到组件
const setterMap: Record<string, Component> = {
  StringSetter,
  NumberSetter,
  SelectSetter,
  ColorSetter,
  BooleanSetter,
}

const getSetterComponent = (setterName?: string): Component => {
  if (!setterName) return StringSetter
  return setterMap[setterName] || StringSetter
}
</script>

<style scoped>
.props-pane {
  padding: 16px;
}

.component-info {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.props-form {
  width: 100%;
}

.props-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.props-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.prop-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.5;
}
</style>
