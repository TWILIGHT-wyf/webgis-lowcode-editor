import mongoose from 'mongoose'

// Project Schema - 存储低代码项目完整数据
const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    pages: {
      type: [
        {
          id: String,
          name: String,
          route: String,
          thumbnail: String,
          components: [mongoose.Schema.Types.Mixed],
          canvasSettings: {
            width: Number,
            height: Number,
            backgroundColor: String,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  },
)

// 添加索引
ProjectSchema.index({ name: 1 })
ProjectSchema.index({ updatedAt: -1 })

export const Project = mongoose.model('Project', ProjectSchema)
