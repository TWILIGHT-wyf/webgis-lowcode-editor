import type { component } from '@/stores/component'

export interface PageTemplate {
  id: string
  name: string
  description: string
  preview: string // 预览图URL
  category: 'dashboard' | 'gis' | 'form' | 'chart' | 'other'
  components: component[]
}

// 数据大屏模板
export const dashboardTemplate: PageTemplate = {
  id: 'dashboard-1',
  name: '数据大屏',
  description: '经典数据可视化大屏布局,包含标题、KPI指标、图表等',
  preview: '',
  category: 'dashboard',
  components: [
    // 标题
    {
      id: 'template_title_' + Date.now(),
      type: 'Text',
      position: { x: 660, y: 30 },
      size: { width: 600, height: 60 },
      rotation: 0,
      zindex: 10,
      style: {
        opacity: 100,
        visible: true,
        fontSize: 36,
        fontColor: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
      props: {
        text: '数据监控大屏',
      },
      animation: {
        name: 'fade',
        class: 'anim-fade',
        duration: 1,
        delay: 0,
        iterationCount: 1,
        timingFunction: 'ease',
        trigger: 'load',
      },
    },
    // KPI 1 - 左上
    {
      id: 'template_kpi1_' + Date.now() + '_1',
      type: 'stat',
      position: { x: 50, y: 120 },
      size: { width: 280, height: 140 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: 20,
      },
      props: {
        title: '总访问量',
        value: 125678,
        change: '+12.5%',
        isIncrease: true,
        titleColor: '#9ca3af',
        valueColor: '#f3f4f6',
        changeColor: '#10b981',
      },
      animation: {
        name: 'slide-left',
        class: 'anim-slide-left',
        duration: 0.8,
        delay: 0.2,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // KPI 2 - 左上
    {
      id: 'template_kpi2_' + Date.now() + '_2',
      type: 'stat',
      position: { x: 360, y: 120 },
      size: { width: 280, height: 140 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: 20,
      },
      props: {
        title: '活跃用户',
        value: 8542,
        change: '+8.3%',
        isIncrease: true,
        titleColor: '#9ca3af',
        valueColor: '#f3f4f6',
        changeColor: '#10b981',
      },
      animation: {
        name: 'slide-left',
        class: 'anim-slide-left',
        duration: 0.8,
        delay: 0.3,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // KPI 3 - 右上
    {
      id: 'template_kpi3_' + Date.now() + '_3',
      type: 'stat',
      position: { x: 1280, y: 120 },
      size: { width: 280, height: 140 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: 20,
      },
      props: {
        title: '转化率',
        value: 68.5,
        change: '+2.1%',
        isIncrease: true,
        titleColor: '#9ca3af',
        valueColor: '#f3f4f6',
        changeColor: '#10b981',
      },
      animation: {
        name: 'slide-left',
        class: 'anim-slide-left',
        duration: 0.8,
        delay: 0.4,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // KPI 4 - 右上
    {
      id: 'template_kpi4_' + Date.now() + '_4',
      type: 'stat',
      position: { x: 1590, y: 120 },
      size: { width: 280, height: 140 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: 20,
      },
      props: {
        title: '销售额',
        value: 1256789,
        change: '+15.8%',
        isIncrease: true,
        titleColor: '#9ca3af',
        valueColor: '#f3f4f6',
        changeColor: '#10b981',
      },
      animation: {
        name: 'slide-left',
        class: 'anim-slide-left',
        duration: 0.8,
        delay: 0.5,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // 折线图 - 左侧
    {
      id: 'template_chart1_' + Date.now() + '_5',
      type: 'lineChart',
      position: { x: 50, y: 300 },
      size: { width: 590, height: 350 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      props: {
        title: '访问趋势',
        xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        seriesName: '访问量',
        seriesData: [820, 932, 901, 934, 1290, 1330, 1320],
        option: JSON.stringify({
          textStyle: { color: '#e5e7eb' },
          title: { textStyle: { color: '#e5e7eb' } },
          legend: { textStyle: { color: '#e5e7eb' } },
          xAxis: {
            axisLabel: { color: '#e5e7eb' },
            nameTextStyle: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#374151' } },
          },
          yAxis: {
            axisLabel: { color: '#e5e7eb' },
            nameTextStyle: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#374151' } },
          },
        }),
      },
      animation: {
        name: 'zoom',
        class: 'anim-zoom',
        duration: 0.8,
        delay: 0.6,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // 柱状图 - 中间
    {
      id: 'template_chart2_' + Date.now() + '_6',
      type: 'barChart',
      position: { x: 670, y: 300 },
      size: { width: 580, height: 350 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      props: {
        title: '产品销量',
        xAxisData: ['产品A', '产品B', '产品C', '产品D', '产品E'],
        seriesName: '销量',
        seriesData: [520, 832, 701, 634, 890],
        option: JSON.stringify({
          textStyle: { color: '#e5e7eb' },
          title: { textStyle: { color: '#e5e7eb' } },
          legend: { textStyle: { color: '#e5e7eb' } },
          xAxis: {
            axisLabel: { color: '#e5e7eb' },
            nameTextStyle: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#374151' } },
          },
          yAxis: {
            axisLabel: { color: '#e5e7eb' },
            nameTextStyle: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#374151' } },
          },
        }),
      },
      animation: {
        name: 'zoom',
        class: 'anim-zoom',
        duration: 0.8,
        delay: 0.7,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // 饼图 - 右侧
    {
      id: 'template_chart3_' + Date.now() + '_7',
      type: 'pieChart',
      position: { x: 1280, y: 300 },
      size: { width: 590, height: 350 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      props: {
        title: '用户分布',
        labels: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
        data: [335, 310, 234, 135, 1548],
      },
      animation: {
        name: 'zoom',
        class: 'anim-zoom',
        duration: 0.8,
        delay: 0.8,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
    // 表格 - 底部
    {
      id: 'template_table_' + Date.now() + '_8',
      type: 'table',
      position: { x: 50, y: 690 },
      size: { width: 1820, height: 350 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1a1f3a',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      props: {
        title: '实时数据',
        columns: ['时间', '用户', '操作', '状态'],
        data: [
          ['14:32:10', '用户A', '登录系统', '成功'],
          ['14:31:45', '用户B', '查看报表', '成功'],
          ['14:30:22', '用户C', '数据导出', '进行中'],
          ['14:29:58', '用户D', '修改配置', '成功'],
        ],
      },
      animation: {
        name: 'slide-up',
        class: 'anim-slide-up',
        duration: 0.8,
        delay: 0.9,
        iterationCount: 1,
        timingFunction: 'ease-out',
        trigger: 'load',
      },
    },
  ],
}

// GIS监控模板
export const gisTemplate: PageTemplate = {
  id: 'gis-1',
  name: 'GIS监控面板',
  description: '地理信息系统监控面板,包含地图、区域统计等',
  preview: '',
  category: 'gis',
  components: [
    // 标题
    {
      id: 'template_gis_title_' + Date.now(),
      type: 'Text',
      position: { x: 660, y: 30 },
      size: { width: 600, height: 50 },
      rotation: 0,
      zindex: 10,
      style: {
        opacity: 100,
        visible: true,
        dataInput: '335, 310, 234, 135, 148',
        labelsInput: 'A类, B类, C类, D类, E类',
        option: JSON.stringify({
          textStyle: { color: '#e5e7eb' },
          title: { textStyle: { color: '#e5e7eb' } },
          legend: { textStyle: { color: '#e5e7eb' } },
        }),
        fontWeight: 'bold',
        textAlign: 'center',
      },
      props: {
        text: 'GIS监控中心',
      },
    },
    // 左侧KPI面板
    {
      id: 'template_gis_kpi1_' + Date.now() + '_1',
      type: 'countUp',
      position: { x: 50, y: 120 },
      size: { width: 300, height: 120 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1e293b',
        borderRadius: 8,
        padding: 20,
      },
      props: {
        title: '在线设备',
        value: 1245,
        suffix: '台',
        duration: 2,
      },
    },
    {
      id: 'template_gis_kpi2_' + Date.now() + '_2',
      type: 'countUp',
      position: { x: 50, y: 260 },
      size: { width: 300, height: 120 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1e293b',
        borderRadius: 8,
        padding: 20,
      },
      props: {
        title: '告警数量',
        value: 23,
        suffix: '条',
        duration: 2,
      },
    },
    // 中间地图占位(需要实际地图组件)
    {
      id: 'template_gis_map_' + Date.now() + '_3',
      type: 'Text',
      position: { x: 380, y: 120 },
      size: { width: 1160, height: 700 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        fontSize: 24,
        fontColor: '#64748b',
        textAlign: 'center',
        backgroundColor: '#0f172a',
        borderRadius: 8,
        padding: 20,
      },
      props: {
        text: '地图区域 (需配置地图组件)',
      },
    },
    // 右侧统计
    {
      id: 'template_gis_chart_' + Date.now() + '_4',
      type: 'barChart',
      position: { x: 1570, y: 120 },
      size: { width: 300, height: 400 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#1e293b',
        borderRadius: 8,
      },
      props: {
        title: '区域分布',
        xAxisData: ['东区', '西区', '南区', '北区'],
        seriesName: '设备数',
        seriesData: [320, 280, 350, 295],
      },
    },
  ],
}

// 图表分析模板
export const chartAnalysisTemplate: PageTemplate = {
  id: 'chart-1',
  name: '图表分析面板',
  description: '多图表数据分析布局,适合数据探索和报表展示',
  preview: '',
  category: 'chart',
  components: [
    // 标题
    {
      id: 'template_chart_title_' + Date.now(),
      type: 'Text',
      position: { x: 760, y: 40 },
      size: { width: 400, height: 50 },
      rotation: 0,
      zindex: 10,
      style: {
        opacity: 100,
        visible: true,
        fontSize: 28,
        fontColor: '#1f2937',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      props: {
        text: '数据分析报表',
      },
    },
    // 2x2 图表布局
    {
      id: 'template_chart_line_' + Date.now() + '_1',
      type: 'lineChart',
      position: { x: 50, y: 120 },
      size: { width: 920, height: 450 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      props: {
        title: '趋势分析',
        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
        seriesName: '销售额',
        seriesData: [1200, 1800, 1500, 2100, 1900, 2400],
      },
    },
    {
      id: 'template_chart_bar_' + Date.now() + '_2',
      type: 'barChart',
      position: { x: 1000, y: 120 },
      size: { width: 870, height: 450 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      props: {
        title: '分类对比',
        xAxisData: ['类别A', '类别B', '类别C', '类别D', '类别E'],
        seriesName: '数量',
        seriesData: [420, 680, 550, 730, 610],
      },
    },
    {
      id: 'template_chart_pie_' + Date.now() + '_3',
      type: 'pieChart',
      position: { x: 50, y: 600 },
      size: { width: 920, height: 440 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      props: {
        title: '占比分析',
        labels: ['A部门', 'B部门', 'C部门', 'D部门'],
        data: [450, 380, 290, 220],
      },
    },
    {
      id: 'template_chart_radar_' + Date.now() + '_4',
      type: 'radarChart',
      position: { x: 1000, y: 600 },
      size: { width: 870, height: 440 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      props: {
        title: '综合评估',
        indicators: ['质量', '效率', '成本', '创新', '服务'],
        data: [85, 72, 68, 90, 78],
      },
    },
  ],
}

// 表单页面模板
export const formTemplate: PageTemplate = {
  id: 'form-1',
  name: '表单页面',
  description: '标准表单布局,包含各类输入控件',
  preview: '',
  category: 'form',
  components: [
    // 表单标题
    {
      id: 'template_form_title_' + Date.now(),
      type: 'Text',
      position: { x: 660, y: 50 },
      size: { width: 600, height: 60 },
      rotation: 0,
      zindex: 10,
      style: {
        opacity: 100,
        visible: true,
        fontSize: 32,
        fontColor: '#1f2937',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      props: {
        text: '信息录入表单',
      },
    },
    // 表单容器
    {
      id: 'template_form_container_' + Date.now() + '_1',
      type: 'panel',
      position: { x: 400, y: 150 },
      size: { width: 1120, height: 800 },
      rotation: 0,
      zindex: 5,
      style: {
        opacity: 100,
        visible: true,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: 40,
      },
      props: {},
    },
  ],
}

// 所有模板
export const templates: PageTemplate[] = [
  dashboardTemplate,
  gisTemplate,
  chartAnalysisTemplate,
  formTemplate,
]

// 根据分类获取模板
export function getTemplatesByCategory(category: PageTemplate['category']): PageTemplate[] {
  return templates.filter((t) => t.category === category)
}

// 根据ID获取模板
export function getTemplateById(id: string): PageTemplate | undefined {
  return templates.find((t) => t.id === id)
}
