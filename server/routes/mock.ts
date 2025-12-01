import { Router } from 'express'

const router = Router()

// 简单计数器（用于演示状态）
let counter = 0

// ========== 基础数据测试 ==========

router.get('/text', (req, res) => {
  res.json({ text: '这是从后端获取的文本内容 ✨' })
})

router.get('/nested', (req, res) => {
  res.json({
    code: 200,
    data: { message: '欢迎使用数据源功能！', user: { name: '张三', age: 25 } },
  })
})

router.get('/list', (req, res) => {
  res.json({
    items: [
      { id: 1, text: '第一项内容' },
      { id: 2, text: '第二项内容' },
      { id: 3, text: '第三项内容' },
    ],
  })
})

router.get('/time', (req, res) => {
  const now = new Date()
  res.json({
    time: now.toLocaleTimeString('zh-CN'),
    date: now.toLocaleDateString('zh-CN'),
    timestamp: now.getTime(),
  })
})

router.get('/counter', (req, res) => {
  counter++
  res.json({ count: counter, message: `计数器: ${counter}` })
})

// ========== 图表数据 ==========

router.get('/chart/simple', (req, res) => {
  res.json({
    chartData: [120, 200, 150, 80, 70, 110, 130],
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  })
})

router.get('/chart/realtime', (req, res) => {
  const count = 7
  const data = Array.from({ length: count }, () => Math.floor(Math.random() * 200 + 50))
  const now = new Date()
  const labels = Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - 1 - i) * 60000)
    return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  res.json({
    success: true,
    result: { series: data, xAxis: labels, timestamp: now.getTime() },
  })
})

router.get('/chart/pie', (req, res) => {
  res.json({
    title: '市场份额分布',
    data: {
      values: [335, 310, 234, 135, 148],
      labels: ['产品A', '产品B', '产品C', '产品D', '产品E'],
    },
  })
})

// ========== 表格/列表数据 ==========

router.get('/table-data', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        id: 1,
        name: '张三',
        age: 28,
        address: '北京市朝阳区',
        department: '技术部',
      },
      {
        id: 2,
        name: '李四',
        age: 32,
        address: '上海市浦东新区',
        department: '市场部',
      },
      {
        id: 3,
        name: '王五',
        age: 25,
        address: '广州市天河区',
        department: '设计部',
      },
    ],
  })
})

router.get('/select-options', (req, res) => {
  res.json({
    code: 200,
    data: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
  })
})

// ========== 地图数据 ==========

router.get('/map/markers', (req, res) => {
  res.json({
    code: 200,
    data: [
      { lat: 39.9042, lng: 116.4074, name: '北京', value: 100 },
      { lat: 31.2304, lng: 121.4737, name: '上海', value: 200 },
      { lat: 23.1291, lng: 113.2644, name: '广州', value: 150 },
    ],
  })
})

// ========== 实时监控数据 ==========

router.get('/stat/realtime', (req, res) => {
  const metrics = ['销售额', '用户数', '转化率', '活跃度']
  const title = metrics[Math.floor(Math.random() * metrics.length)]
  const value = Math.floor(Math.random() * 10000 + 1000)
  const change = parseFloat((Math.random() * 30 - 15).toFixed(1))

  res.json({
    title,
    value,
    change,
    timestamp: new Date().toLocaleTimeString('zh-CN'),
  })
})

router.get('/progress/realtime', (req, res) => {
  const progress = Math.floor(Math.random() * 100)
  const status = progress >= 80 ? 'success' : progress >= 50 ? 'warning' : 'exception'

  res.json({
    value: progress,
    status,
    timestamp: new Date().toLocaleTimeString('zh-CN'),
  })
})

export default router
