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

// 20. 图表数据 - 饼图
app.get('/api/chart/pie', (req, res) => {
  res.json({
    title: '市场份额分布',
    data: {
      values: [335, 310, 234, 135, 148],
      labels: ['产品A', '产品B', '产品C', '产品D', '产品E'],
    },
  })
})

// 21. 图表数据 - 环形图 (动态数据)
app.get('/api/chart/doughnut', (req, res) => {
  const categories = ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  const values = categories.map(() => Math.floor(Math.random() * 2000) + 100)

  res.json({
    title: '访问来源',
    data: {
      values: values,
      labels: categories,
    },
    timestamp: Date.now(),
  })
})

// 22. 图表数据 - 散点图
app.get('/api/chart/scatter', (req, res) => {
  // 生成随机散点数据
  const points = []
  for (let i = 0; i < 20; i++) {
    points.push([
      parseFloat((Math.random() * 15 + 5).toFixed(2)),
      parseFloat((Math.random() * 10 + 3).toFixed(2)),
    ])
  }

  res.json({
    title: '相关性分析',
    data: {
      points: points,
    },
  })
})

// 24. 指标卡数据
app.get('/api/stat', (req, res) => {
  const baseValue = 10000
  const change = (Math.random() * 20 - 10).toFixed(1) // -10% 到 +10%
  const value = Math.floor(baseValue + Math.random() * 5000)

  res.json({
    title: '月销售额',
    value: value,
    change: parseFloat(change),
  })
})

// 25. 指标卡数据 - 嵌套格式
app.get('/api/stat/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      kpi: {
        title: '用户增长率',
        value: 85.6,
        change: 12.3,
      },
    },
  })
})

// 26. 指标卡数据 - 实时更新
app.get('/api/stat/realtime', (req, res) => {
  const metrics = ['销售额', '用户数', '转化率', '活跃度']
  const title = metrics[Math.floor(Math.random() * metrics.length)]
  const value = Math.floor(Math.random() * 10000 + 1000)
  const change = parseFloat((Math.random() * 30 - 15).toFixed(1))

  res.json({
    title: title,
    value: value,
    change: change,
    timestamp: new Date().toLocaleTimeString('zh-CN'),
  })
})

// 27. 数字跳动 - 简单格式
app.get('/api/countup', (req, res) => {
  const value = Math.floor(Math.random() * 100000 + 50000)

  res.json({
    value: value,
  })
})

// 28. 数字跳动 - 嵌套格式
app.get('/api/countup/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      statistics: {
        totalUsers: 123456,
        activeToday: 8765,
        revenue: 987654.32,
      },
    },
  })
})

// 29. 数字跳动 - 实时更新
app.get('/api/countup/realtime', (req, res) => {
  const metrics = {
    users: Math.floor(Math.random() * 10000 + 50000),
    orders: Math.floor(Math.random() * 1000 + 500),
    revenue: parseFloat((Math.random() * 100000 + 50000).toFixed(2)),
    views: Math.floor(Math.random() * 50000 + 10000),
  }

  res.json({
    value: metrics[Object.keys(metrics)[Math.floor(Math.random() * 4)]],
    timestamp: new Date().getTime(),
  })
})

// 30. 进度条 - 简单格式
app.get('/api/progress', (req, res) => {
  const value = Math.floor(Math.random() * 100)

  res.json({
    value: value,
  })
})

// 31. 进度条 - 嵌套格式
app.get('/api/progress/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      task: {
        completed: 75,
        total: 100,
        percentage: 75,
      },
    },
  })
})

// 32. 进度条 - 实时更新
app.get('/api/progress/realtime', (req, res) => {
  const progress = Math.floor(Math.random() * 100)
  let status = ''
  if (progress >= 80) status = 'success'
  else if (progress >= 60) status = 'warning'
  else if (progress < 30) status = 'exception'

  res.json({
    value: progress,
    status: status,
    timestamp: new Date().toLocaleTimeString('zh-CN'),
  })
})

// 33. 徽章 - 简单格式
app.get('/api/badge', (req, res) => {
  const value = Math.floor(Math.random() * 200)

  res.json({
    value: value,
  })
})

// 34. 徽章 - 嵌套格式
app.get('/api/badge/nested', (req, res) => {
  res.json({
    code: 200,
    data: {
      notifications: {
        unread: 99,
        total: 156,
      },
    },
  })
})

// 35. 徽章 - 实时更新
app.get('/api/badge/realtime', (req, res) => {
  const types = ['primary', 'success', 'warning', 'danger', 'info']
  const value = Math.floor(Math.random() * 150)
  const type = types[Math.floor(Math.random() * types.length)]

  res.json({
    value: value,
    type: type,
    timestamp: new Date().getTime(),
  })
})

// 36. 数字跳动 - 带标题（新增用于测试）
app.get('/api/countup/withtitle', (req, res) => {
  const titles = ['总销售额', '用户数', '订单量', '访问量', '营收']
  const title = titles[Math.floor(Math.random() * titles.length)]
  const value = Math.floor(Math.random() * 1000000 + 100000)

  res.json({
    title: title,
    value: value,
    timestamp: new Date().getTime(),
  })
})

// 37. 数字跳动 - 完整格式（新增用于测试）
app.get('/api/countup/full', (req, res) => {
  res.json({
    data: {
      metrics: {
        title: '月度目标完成率',
        current: 87.5,
        prefix: '',
        suffix: '%',
      },
    },
  })
})

// 21. 表格数据
app.get('/api/table-data', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        id: 1,
        name: '张三',
        age: 28,
        address: '北京市朝阳区',
        department: '技术部',
        email: 'zhangsan@example.com',
      },
      {
        id: 2,
        name: '李四',
        age: 32,
        address: '上海市浦东新区',
        department: '市场部',
        email: 'lisi@example.com',
      },
      {
        id: 3,
        name: '王五',
        age: 25,
        address: '广州市天河区',
        department: '设计部',
        email: 'wangwu@example.com',
      },
      {
        id: 4,
        name: '赵六',
        age: 30,
        address: '深圳市南山区',
        department: '产品部',
        email: 'zhaoliu@example.com',
      },
      {
        id: 5,
        name: '钱七',
        age: 27,
        address: '杭州市西湖区',
        department: '运营部',
        email: 'qianqi@example.com',
      },
    ],
  })
})

// 22. 列表数据
app.get('/api/list-items', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        title: '新版本上线通知',
        description: '系统将于今晚 22:00 进行版本更新，预计持续 30 分钟',
        extra: '重要',
        timestamp: '2024-01-15 14:30',
      },
      {
        title: '团队会议提醒',
        description: '本周五下午 3 点召开季度总结会议，请提前准备相关材料',
        extra: '会议',
        timestamp: '2024-01-14 10:20',
      },
      {
        title: '项目进度更新',
        description: 'WebGIS 项目第一阶段已完成 85%，预计下周进入测试阶段',
        extra: '进展',
        timestamp: '2024-01-13 16:45',
      },
      {
        title: '安全漏洞修复',
        description: '发现并修复了一个中等级别的安全漏洞，已部署到生产环境',
        extra: '安全',
        timestamp: '2024-01-12 09:15',
      },
      {
        title: '新功能开发',
        description: '数据可视化模块新增 4 个组件：占位盒、表格、列表、时间轴',
        extra: '功能',
        timestamp: '2024-01-11 11:00',
      },
    ],
  })
})

// 23. 时间轴数据
app.get('/api/timeline-events', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        title: '项目启动',
        content: 'WebGIS 可视化项目正式启动，完成需求分析和技术选型',
        timestamp: '2024-01-01 09:00',
        type: 'primary',
        extra: '里程碑',
      },
      {
        title: '原型设计完成',
        content: '完成所有页面的原型设计，包括编辑器、组件面板、属性配置等核心功能',
        timestamp: '2024-01-05 15:30',
        type: 'success',
        extra: '设计',
      },
      {
        title: '基础框架搭建',
        content: '完成 Vue3 + TypeScript 项目搭建，配置 Vite、ESLint、Pinia 等工具',
        timestamp: '2024-01-08 10:00',
        type: 'success',
        extra: '开发',
      },
      {
        title: '组件系统开发',
        content: '开发了图表组件、KPI 组件、布局组件等 20+ 可视化组件',
        timestamp: '2024-01-12 16:00',
        type: 'success',
        extra: '开发',
      },
      {
        title: '数据源功能',
        content: '实现了组件数据源配置，支持 HTTP 请求、实时轮询、数据路径提取',
        timestamp: '2024-01-15 14:20',
        type: 'warning',
        extra: '功能',
      },
      {
        title: '测试阶段',
        content: '进入全面测试阶段，修复已知 bug，优化性能和用户体验',
        timestamp: '2024-01-18 11:00',
        type: 'info',
        extra: '测试',
      },
    ],
  })
})

// 24. 占位盒内容
app.get('/api/box-content', (req, res) => {
  const messages = [
    '欢迎使用 WebGIS 可视化平台 🎉',
    '系统运行正常 ✅',
    '当前在线用户: 1,234 人',
    '今日访问量: 5,678 次',
    '数据更新时间: ' + new Date().toLocaleTimeString('zh-CN'),
  ]

  res.json({
    content: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString(),
  })
})

// 25. 卡片网格数据
app.get('/api/card-grid', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        title: '产品 A',
        description: '这是一款创新的产品，具有优秀的性能和用户体验',
        footer: '2024-01-15',
        tags: ['热门', '新品'],
        image: 'https://via.placeholder.com/300x150',
      },
      {
        title: '产品 B',
        description: '经典款产品，市场占有率高，深受用户喜爱',
        footer: '2024-01-12',
        tags: ['经典', '畅销'],
        image: 'https://via.placeholder.com/300x150',
      },
      {
        title: '产品 C',
        description: '高端定制产品，专为企业客户设计',
        footer: '2024-01-10',
        tags: ['高端', '定制'],
        image: 'https://via.placeholder.com/300x150',
      },
      {
        title: '产品 D',
        description: '入门级产品，性价比高，适合个人用户',
        footer: '2024-01-08',
        tags: ['入门', '实惠'],
        image: 'https://via.placeholder.com/300x150',
      },
      {
        title: '产品 E',
        description: '专业版产品，功能强大，适合专业用户',
        footer: '2024-01-05',
        tags: ['专业', '强大'],
        image: 'https://via.placeholder.com/300x150',
      },
      {
        title: '产品 F',
        description: '轻量级产品，简单易用，快速上手',
        footer: '2024-01-03',
        tags: ['轻量', '易用'],
        image: 'https://via.placeholder.com/300x150',
      },
    ],
  })
})

// 26. 透视分析数据
app.get('/api/pivot-data', (req, res) => {
  res.json({
    code: 200,
    data: [
      {
        category: '产品A',
        region: '华东',
        q1: 1200,
        q2: 1500,
        q3: 1800,
        q4: 2100,
      },
      {
        category: '产品A',
        region: '华南',
        q1: 1100,
        q2: 1300,
        q3: 1600,
        q4: 1900,
      },
      {
        category: '产品A',
        region: '华北',
        q1: 1000,
        q2: 1200,
        q3: 1400,
        q4: 1700,
      },
      {
        category: '产品B',
        region: '华东',
        q1: 900,
        q2: 1100,
        q3: 1300,
        q4: 1500,
      },
      {
        category: '产品B',
        region: '华南',
        q1: 800,
        q2: 1000,
        q3: 1200,
        q4: 1400,
      },
      {
        category: '产品B',
        region: '华北',
        q1: 850,
        q2: 1050,
        q3: 1250,
        q4: 1450,
      },
      {
        category: '产品C',
        region: '华东',
        q1: 700,
        q2: 900,
        q3: 1100,
        q4: 1300,
      },
      {
        category: '产品C',
        region: '华南',
        q1: 650,
        q2: 850,
        q3: 1050,
        q4: 1250,
      },
      {
        category: '产品C',
        region: '华北',
        q1: 600,
        q2: 800,
        q3: 1000,
        q4: 1200,
      },
    ],
  })
})

// 27. 下拉选择选项数据
app.get('/api/select-options', (req, res) => {
  res.json({
    code: 200,
    data: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
      { label: '杭州', value: 'hangzhou' },
      { label: '成都', value: 'chengdu' },
      { label: '武汉', value: 'wuhan' },
      { label: '西安', value: 'xian' },
      { label: '重庆', value: 'chongqing' },
      { label: '南京', value: 'nanjing' },
    ],
  })
})

// 28. 多选选择选项数据 (分类标签)
app.get('/api/multi-select-options', (req, res) => {
  res.json({
    code: 200,
    data: [
      { label: 'Vue.js', value: 'vue', disabled: false },
      { label: 'React', value: 'react', disabled: false },
      { label: 'Angular', value: 'angular', disabled: false },
      { label: 'TypeScript', value: 'typescript', disabled: false },
      { label: 'JavaScript', value: 'javascript', disabled: false },
      { label: 'Element Plus', value: 'element-plus', disabled: false },
      { label: 'Ant Design', value: 'ant-design', disabled: false },
      { label: 'Vite', value: 'vite', disabled: false },
      { label: 'Webpack', value: 'webpack', disabled: false },
      { label: 'Pinia', value: 'pinia', disabled: false },
    ],
  })
})

// 29. 复选组选项数据
app.get('/api/checkbox-options', (req, res) => {
  res.json({
    success: true,
    data: [
      { label: '苹果', value: 'apple', disabled: false },
      { label: '香蕉', value: 'banana', disabled: false },
      { label: '橙子', value: 'orange', disabled: false },
      { label: '西瓜', value: 'watermelon', disabled: false },
      { label: '葡萄', value: 'grape', disabled: false },
      { label: '草莓', value: 'strawberry', disabled: false },
      { label: '樱桃', value: 'cherry', disabled: true },
      { label: '芒果', value: 'mango', disabled: false },
    ],
  })
})

// 30. 按钮组数据
app.get('/api/button-group', (req, res) => {
  res.json({
    success: true,
    data: [
      { label: '保存', value: 'save', type: 'primary', icon: '', disabled: false },
      { label: '编辑', value: 'edit', type: 'default', icon: '', disabled: false },
      { label: '删除', value: 'delete', type: 'danger', icon: '', disabled: false },
      { label: '导出', value: 'export', type: 'success', icon: '', disabled: false },
      { label: '刷新', value: 'refresh', type: 'info', icon: '', disabled: false },
    ],
  })
})

// 31. Tabs 标签页数据
app.get('/api/tabs', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        label: '用户管理',
        value: 'users',
        content: '这里是用户管理的内容区域，包含用户列表、新增用户、编辑用户等功能。',
      },
      {
        label: '角色权限',
        value: 'roles',
        content: '这里是角色权限管理的内容区域，可以配置不同角色的权限范围。',
      },
      {
        label: '系统设置',
        value: 'settings',
        content: '这里是系统设置的内容区域，包含基本设置、安全设置、通知设置等。',
      },
      {
        label: '日志审计',
        value: 'logs',
        content: '这里是日志审计的内容区域，可以查看系统操作日志、登录日志等信息。',
      },
    ],
  })
})

// 32. 图片数据
app.get('/api/image', (req, res) => {
  const images = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
  ]
  const randomIndex = Math.floor(Math.random() * images.length)
  res.json({
    success: true,
    data: {
      url: images[randomIndex],
      title: `随机图片 ${randomIndex + 1}`,
    },
  })
})

// 33. 视频数据
app.get('/api/video', (req, res) => {
  res.json({
    success: true,
    data: {
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster: 'https://via.placeholder.com/800x600',
      title: '示例视频',
    },
  })
})

// 34. Markdown 内容
app.get('/api/markdown', (req, res) => {
  res.json({
    success: true,
    data: {
      content:
        '# Markdown 示例\\n\\n## 功能特点\\n\\n- 支持标题\\n- 支持 **粗体** 和 *斜体*\\n- 支持列表\\n\\n```javascript\\nconsole.log("Hello")\\n```',
    },
  })
})

// 35. HTML 内容
app.get('/api/html', (req, res) => {
  res.json({
    success: true,
    data: {
      content:
        '<div style="padding:20px;background:#667eea;color:white;border-radius:8px;"><h2>HTML 示例</h2><p>这是动态 HTML 内容</p></div>',
    },
  })
})

// 36. iframe URL
app.get('/api/iframe', (req, res) => {
  res.json({
    success: true,
    data: {
      url: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606',
      title: '地图示例',
    },
  })
})

// 37. 脚本内容
app.get('/api/scripting', (req, res) => {
  const scripts = [
    `// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
    `// 生成随机数据
const randomData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
console.log('随机数据:', randomData);
console.log('平均值:', randomData.reduce((a, b) => a + b) / randomData.length);
console.log('最大值:', Math.max(...randomData));
console.log('最小值:', Math.min(...randomData));`,
    `// 日期时间操作
const now = new Date();
console.log('当前时间:', now.toLocaleString('zh-CN'));
console.log('时间戳:', now.getTime());
console.log('星期:', ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]);
console.log('本月天数:', new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());`,
  ]

  const randomScript = scripts[Math.floor(Math.random() * scripts.length)]

  res.json({
    success: true,
    data: {
      script: randomScript,
    },
  })
})

// 38. 状态数据
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    data: {
      state: {
        // 系统信息
        system: {
          name: 'WebGIS Platform',
          version: '2.0.1',
          uptime: Math.floor(Math.random() * 86400),
          status: ['online', 'maintenance', 'offline'][Math.floor(Math.random() * 3)],
        },
        // 用户信息
        user: {
          id: 1001,
          name: 'Admin',
          role: 'administrator',
          permissions: ['read', 'write', 'delete', 'admin'],
          loginTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        },
        // 统计数据
        statistics: {
          totalUsers: Math.floor(Math.random() * 10000),
          activeUsers: Math.floor(Math.random() * 1000),
          totalRequests: Math.floor(Math.random() * 1000000),
          errorRate: (Math.random() * 5).toFixed(2) + '%',
        },
        // 配置信息
        config: {
          theme: ['light', 'dark'][Math.floor(Math.random() * 2)],
          language: 'zh-CN',
          autoSave: true,
          notifications: true,
        },
        // 实时数据
        realtime: {
          timestamp: Date.now(),
          temperature: (20 + Math.random() * 10).toFixed(1) + '°C',
          humidity: (40 + Math.random() * 30).toFixed(1) + '%',
          pressure: (1000 + Math.random() * 50).toFixed(0) + ' hPa',
        },
      },
    },
  })
})

// 39. 触发器条件
app.get('/api/trigger', (req, res) => {
  const actions = [
    { action: 'log', actionData: '系统日志记录' },
    { action: 'alert', actionData: '重要提醒：请注意系统状态' },
    { action: 'dispatch', actionData: 'data-update' },
    { action: 'api', actionData: 'http://localhost:3001/api/callback' },
  ]

  const randomAction = actions[Math.floor(Math.random() * actions.length)]

  res.json({
    success: true,
    data: {
      condition: `value > ${Math.floor(Math.random() * 100)}`,
      enabled: Math.random() > 0.3,
      ...randomAction,
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

  console.log('1️⃣4️⃣ 饼图')
  console.log(`   URL: http://localhost:${PORT}/api/chart/pie`)
  console.log('   数据路径: data.values | 标签路径: data.labels\n')

  console.log('1️⃣5️⃣ 环形图 (动态数据，建议刷新: 3秒)')
  console.log(`   URL: http://localhost:${PORT}/api/chart/doughnut`)
  console.log('   数据路径: data.values | 标签路径: data.labels\n')

  console.log('1️⃣6️⃣ 散点图')
  console.log(`   URL: http://localhost:${PORT}/api/chart/scatter`)
  console.log('   数据路径: data.points (二维数组格式)\n')

  console.log('1️⃣7️⃣ 饼图 - 实时变化 (建议刷新: 2秒)')
  console.log(`   URL: http://localhost:${PORT}/api/chart/pie-realtime`)
  console.log('   数据路径: data.values | 标签路径: data.labels\n')

  console.log('📊 指标卡数据接口：\n')

  console.log('1️⃣8️⃣ 指标卡 - 简单格式')
  console.log(`   URL: http://localhost:${PORT}/api/stat`)
  console.log('   标题路径: title | 数值路径: value | 变化路径: change\n')

  console.log('1️⃣9️⃣ 指标卡 - 嵌套格式')
  console.log(`   URL: http://localhost:${PORT}/api/stat/nested`)
  console.log(
    '   标题路径: data.kpi.title | 数值路径: data.kpi.value | 变化路径: data.kpi.change\n',
  )

  console.log('2️⃣0️⃣ 指标卡 - 实时更新 (建议刷新: 3秒)')
  console.log(`   URL: http://localhost:${PORT}/api/stat/realtime`)
  console.log('   标题路径: title | 数值路径: value | 变化路径: change\n')

  console.log('📋 表格、列表、时间轴数据接口：\n')

  console.log('2️⃣1️⃣ 表格数据')
  console.log(`   URL: http://localhost:${PORT}/api/table-data`)
  console.log('   数据路径: data\n')

  console.log('2️⃣2️⃣ 列表数据')
  console.log(`   URL: http://localhost:${PORT}/api/list-items`)
  console.log('   数据路径: data\n')

  console.log('2️⃣3️⃣ 时间轴数据')
  console.log(`   URL: http://localhost:${PORT}/api/timeline-events`)
  console.log('   数据路径: data\n')

  console.log('2️⃣4️⃣ 占位盒内容')
  console.log(`   URL: http://localhost:${PORT}/api/box-content`)
  console.log('   数据路径: content\n')

  console.log('2️⃣5️⃣ 卡片网格数据')
  console.log(`   URL: http://localhost:${PORT}/api/card-grid`)
  console.log('   数据路径: data\n')

  console.log('2️⃣6️⃣ 透视分析数据')
  console.log(`   URL: http://localhost:${PORT}/api/pivot-data`)
  console.log('   数据路径: data\n')

  console.log('2️⃣7️⃣ 下拉选择选项')
  console.log(`   URL: http://localhost:${PORT}/api/select-options`)
  console.log('   数据路径: data\n')

  console.log('2️⃣8️⃣ 多选选择选项')
  console.log(`   URL: http://localhost:${PORT}/api/multi-select-options`)
  console.log('   数据路径: data\n')

  console.log('2️⃣9️⃣ 复选组选项')
  console.log(`   URL: http://localhost:${PORT}/api/checkbox-options`)
  console.log('   数据路径: data\n')

  console.log('3️⃣0️⃣ 按钮组数据')
  console.log(`   URL: http://localhost:${PORT}/api/button-group`)
  console.log('   数据路径: data\n')

  console.log('💡 提示: 按 Ctrl+C 停止服务器')
  console.log('='.repeat(60) + '\n')
})
