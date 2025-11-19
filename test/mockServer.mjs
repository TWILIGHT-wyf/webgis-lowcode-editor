import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// 启用 CORS
app.use(cors())
app.use(express.json())

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
  next()
})

// 计数器
let counter = 0

// 1. 简单文本
app.get('/api/text', (req, res) => {
  res.json({
    text: '这是从后端获取的文本内容 ✨',
  })
})

// 2. 嵌套数据
app.get('/api/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      message: '欢迎使用数据源功能！',
      user: {
        name: '张三',
        age: 25,
      },
    },
  })
})

// 3. 数组数据
app.get('/api/list', (req, res) => {
  res.json({
    items: [
      { id: 1, text: '第一项内容' },
      { id: 2, text: '第二项内容' },
      { id: 3, text: '第三项内容' },
    ],
  })
})

// 4. 实时时间
app.get('/api/time', (req, res) => {
  const now = new Date()
  res.json({
    time: now.toLocaleTimeString('zh-CN'),
    date: now.toLocaleDateString('zh-CN'),
    timestamp: now.getTime(),
  })
})

// 5. 随机数
app.get('/api/random', (req, res) => {
  res.json({
    value: Math.floor(Math.random() * 1000),
    message: `随机数: ${Math.floor(Math.random() * 1000)}`,
  })
})

// 6. 计数器（轮询测试）
app.get('/api/counter', (req, res) => {
  counter++
  res.json({
    count: counter,
    message: `计数器: ${counter}`,
  })
})

// 7. 温度传感器
app.get('/api/temperature', (req, res) => {
  const temp = (20 + Math.random() * 10).toFixed(1)
  res.json({
    data: {
      value: temp,
      unit: '°C',
      display: `${temp}°C`,
    },
  })
})

// 8. 天气数据
app.get('/api/weather', (req, res) => {
  const conditions = ['晴', '多云', '阴', '小雨']
  const temps = [18, 22, 25, 28, 30]

  res.json({
    city: '北京',
    temperature: temps[Math.floor(Math.random() * temps.length)],
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    time: new Date().toLocaleTimeString('zh-CN'),
  })
})

// 9. POST 测试
app.post('/api/echo', (req, res) => {
  console.log('收到 POST 数据:', req.body)
  res.json({
    message: '数据接收成功',
    received: req.body,
    timestamp: new Date().toISOString(),
  })
})

// 10. 延迟接口（测试加载状态）
app.get('/api/slow', (req, res) => {
  setTimeout(() => {
    res.json({
      message: '这是延迟 2 秒返回的数据',
    })
  }, 2000)
})

// 11. 错误接口
app.get('/api/error', (req, res) => {
  res.status(500).json({
    error: '模拟的服务器错误',
  })
})

// 12. 图表数据 - 简单格式
app.get('/api/chart/simple', (req, res) => {
  res.json({
    chartData: [120, 200, 150, 80, 70, 110, 130],
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  })
})

// 13. 图表数据 - 嵌套格式
app.get('/api/chart/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      chart: {
        values: [820, 932, 901, 934, 1290, 1330],
        categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
      },
      title: '月度销售数据',
    },
  })
})

// 14. 图表数据 - 实时动态（每次不同）
app.get('/api/chart/realtime', (req, res) => {
  const count = 7
  const data = Array.from({ length: count }, () => Math.floor(Math.random() * 200 + 50))
  const now = new Date()
  const labels = Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - 1 - i) * 60000)
    return `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`
  })

  res.json({
    success: true,
    result: {
      series: data,
      xAxis: labels,
      timestamp: now.getTime(),
    },
  })
})

// 15. 图表数据 - 温度监控
app.get('/api/chart/temperature', (req, res) => {
  const hours = 12
  const temps = []
  const times = []
  const now = new Date()

  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    times.push(`${time.getHours()}:00`)
    temps.push(parseFloat((20 + Math.random() * 10).toFixed(1)))
  }

  res.json({
    sensor: 'temp-01',
    readings: {
      temperatures: temps,
      timestamps: times,
    },
    unit: '°C',
  })
})

// 16. 图表数据 - 服务器监控
app.get('/api/chart/server', (req, res) => {
  res.json({
    server: 'web-server-01',
    metrics: {
      cpu: [45, 52, 48, 65, 58, 62, 55, 60, 58, 63],
      memory: [60, 62, 65, 68, 70, 72, 75, 73, 71, 74],
      time: [
        '10:00',
        '10:10',
        '10:20',
        '10:30',
        '10:40',
        '10:50',
        '11:00',
        '11:10',
        '11:20',
        '11:30',
      ],
    },
  })
})

// 17. 图表数据 - 用户活跃度
app.get('/api/chart/users', (req, res) => {
  const baseCount = 1000
  const growth = Array.from(
    { length: 8 },
    (_, i) => baseCount + i * 150 + Math.floor(Math.random() * 100),
  )

  res.json({
    period: 'weekly',
    analytics: {
      activeUsers: growth,
      weeks: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    },
  })
})

// 18. 图表数据 - 股票价格
app.get('/api/chart/stock', (req, res) => {
  const basePrice = 100
  const prices = []
  const times = []

  for (let i = 0; i < 30; i++) {
    const variation = (Math.random() - 0.5) * 5
    prices.push(parseFloat((basePrice + variation).toFixed(2)))
    times.push(`${9 + Math.floor(i / 6)}:${(i % 6) * 10}`)
  }

  res.json({
    symbol: 'TECH',
    quote: {
      prices: prices,
      times: times,
    },
  })
})

// 19. 图表数据 - 堆叠柱状图
app.get('/api/chart/stacked', (req, res) => {
  res.json({
    title: '销售数据对比',
    data: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      seriesNames: ['线上销售', '线下销售', '批发'],
      seriesData: [
        [120, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 232, 201, 154, 190, 330, 410],
      ],
    },
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60))
  console.log(`🚀 数据源测试服务器已启动！`)
  console.log(`📡 地址: http://localhost:${PORT}`)
  console.log('='.repeat(60) + '\n')
  console.log('📋 快速测试配置：\n')
  console.log('1️⃣  简单文本')
  console.log(`   URL: http://localhost:${PORT}/api/text`)
  console.log('   数据路径: text\n')

  console.log('2️⃣  嵌套数据')
  console.log(`   URL: http://localhost:${PORT}/api/nested`)
  console.log('   数据路径: data.message\n')

  console.log('3️⃣  实时时间（建议刷新间隔: 1秒）')
  console.log(`   URL: http://localhost:${PORT}/api/time`)
  console.log('   数据路径: time\n')

  console.log('4️⃣  计数器（建议刷新间隔: 2秒）')
  console.log(`   URL: http://localhost:${PORT}/api/counter`)
  console.log('   数据路径: message\n')

  console.log('5️⃣  温度传感器（建议刷新间隔: 3秒）')
  console.log(`   URL: http://localhost:${PORT}/api/temperature`)
  console.log('   数据路径: data.display\n')

  console.log('📊 图表数据接口：\n')

  console.log('6️⃣  简单图表')
  console.log(`   URL: http://localhost:${PORT}/api/chart/simple`)
  console.log('   数据路径: chartData | X轴路径: labels\n')

  console.log('7️⃣  嵌套图表')
  console.log(`   URL: http://localhost:${PORT}/api/chart/nested`)
  console.log('   数据路径: data.chart.values | X轴路径: data.chart.categories\n')

  console.log('8️⃣  实时动态图（建议刷新: 2秒）')
  console.log(`   URL: http://localhost:${PORT}/api/chart/realtime`)
  console.log('   数据路径: result.series | X轴路径: result.xAxis\n')

  console.log('9️⃣  温度监控图（建议刷新: 3秒）')
  console.log(`   URL: http://localhost:${PORT}/api/chart/temperature`)
  console.log('   数据路径: readings.temperatures | X轴路径: readings.timestamps\n')

  console.log('🔟 服务器监控 - CPU')
  console.log(`   URL: http://localhost:${PORT}/api/chart/server`)
  console.log('   数据路径: metrics.cpu | X轴路径: metrics.time\n')

  console.log('1️⃣1️⃣ 用户活跃度')
  console.log(`   URL: http://localhost:${PORT}/api/chart/users`)
  console.log('   数据路径: analytics.activeUsers | X轴路径: analytics.weeks\n')

  console.log('1️⃣2️⃣ 股票价格（建议刷新: 5秒）')
  console.log(`   URL: http://localhost:${PORT}/api/chart/stock`)
  console.log('   数据路径: quote.prices | X轴路径: quote.times\n')

  console.log('1️⃣3️⃣ 堆叠柱状图')
  console.log(`   URL: http://localhost:${PORT}/api/chart/stacked`)
  console.log('   X轴路径: data.categories')
  console.log('   系列名称路径: data.seriesNames')
  console.log('   系列数据路径: data.seriesData\n')

  console.log('='.repeat(60))
  console.log('💡 提示: 按 Ctrl+C 停止服务器')
  console.log('='.repeat(60) + '\n')
})
