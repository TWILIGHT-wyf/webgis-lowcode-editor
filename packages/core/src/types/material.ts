/**
 * 物料描述协议：描述组件在"编辑器"中的表现
 * 编辑器根据这个协议自动生成属性面板 (Property Panel)
 */
export interface MaterialMeta {
  componentName: string // 对应 @lowcode/ui 的导出名
  title: string // 显示名称 (e.g. '文本')
  category: string // 分类 (e.g. '基础', '图表')
  screenshot?: string // 缩略图 URL

  // 属性配置器：定义右侧面板如何渲染
  props: {
    [propName: string]: PropConfig
  }

  // 组件支持的事件
  events?: string[] // e.g. ['onClick', 'onHover']
}

export interface PropConfig {
  title: string // 属性名
  // 设置器：描述用什么控件来编辑这个属性
  setter:
    | 'StringSetter'
    | 'NumberSetter'
    | 'BooleanSetter'
    | 'SelectSetter'
    | 'ColorSetter'
    | 'JsonSetter'
    | string
  // 传递给设置器的参数 (如 Select 的 options)
  setterProps?: Record<string, any>
  defaultValue?: any
}
