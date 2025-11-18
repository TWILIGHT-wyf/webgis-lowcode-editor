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

  console.log('='.repeat(60))
  console.log('💡 提示: 按 Ctrl+C 停止服务器')
  console.log('='.repeat(60) + '\n')
})
