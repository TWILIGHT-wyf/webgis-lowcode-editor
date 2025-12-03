<template>
  <BaseScale
    :max-width="maxWidth"
    :zoom="zoom"
    :segments="segments"
    :line-color="lineColor"
    :text-color="textColor"
    :background-color="backgroundColor"
    :font-size="fontSize"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useComponent } from '@/stores/component'
import { vScale as BaseScale } from '@twi1i9ht/visual-lib'

const props = defineProps<{ id: string }>()

const { componentStore } = storeToRefs(useComponent())
const comp = computed(() => componentStore.value.find((c) => c.id === props.id))

const maxWidth = computed(() => (comp.value?.props.maxWidth as number) ?? 100)
const zoom = computed(() => (comp.value?.props.zoom as number) ?? 10)
const segments = computed(() => (comp.value?.props.segments as number) ?? 4)
const lineColor = computed(() => (comp.value?.props.lineColor as string) || '#303133')
const textColor = computed(() => (comp.value?.props.textColor as string) || '#303133')
const backgroundColor = computed(
  () => (comp.value?.props.backgroundColor as string) || 'rgba(255, 255, 255, 0.8)',
)
const fontSize = computed(() => (comp.value?.props.fontSize as number) ?? 11)
</script>
