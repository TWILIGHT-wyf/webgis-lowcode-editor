import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSizeStore = defineStore('size', () => {
  const height = ref<number>(1080)
  const width = ref<number>(1920)
  const scale = ref<number>(1)
  const area = computed(() => height.value * width.value)

  // 画布配置
  const canvasConfig = ref({
    backgroundColor: '#fafafa',
    gridColor: '#f0f0f0',
    gridMajorColor: '#e5e5e5',
    showGrid: true,
    gridSize: 20,
    gridMajorSize: 100,
    backgroundImage: '',
  })

  function setSize(w: number, h: number) {
    width.value = Math.max(1, Math.floor(w))
    height.value = Math.max(1, Math.floor(h))
  }
  function setScale(s: number, min = 0.2, max = 4) {
    scale.value = Math.min(max, Math.max(min, s))
  }

  function updateCanvasConfig(config: Partial<typeof canvasConfig.value>) {
    Object.assign(canvasConfig.value, config)
  }

  return { width, height, scale, area, canvasConfig, setSize, setScale, updateCanvasConfig }
})
