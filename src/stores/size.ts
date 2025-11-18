import { defineStore } from "pinia";
import { ref , computed } from 'vue'

export const useSizeStore = defineStore('size', () => {
  const height = ref<number>(1080)
  const width = ref<number>(1920)
  const scale = ref<number>(1)
  const area = computed(() => height.value * width.value)

  function setSize(w: number, h: number) {
    width.value = Math.max(1, Math.floor(w))
    height.value = Math.max(1, Math.floor(h))
  }
  function setScale(s: number, min = 0.2, max = 4) {
    scale.value = Math.min(max, Math.max(min, s))
  }

  return { width, height, scale, area, setSize, setScale }
})
