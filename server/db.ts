import mongoose from 'mongoose'
import dotenv from 'dotenv'

// 确保环境变量已加载
dotenv.config()

const MONGO_URI =
  process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webgis'

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB 连接成功')
    console.log(`📦 数据库: ${MONGO_URI}`)
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error)
    // 不退出进程，让 AI 代理和测试接口继续可用
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB 断开连接')
  } catch (error) {
    console.error('❌ MongoDB 断开连接失败:', error)
  }
}
