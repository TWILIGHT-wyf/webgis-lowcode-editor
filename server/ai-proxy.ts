/**
 * AI 代理服务器 (TypeScript) - 多模型版本
 * 支持 Gemini、OpenAI、Claude、通义千问、DeepSeek 等多家 AI
 *
 * 使用方法:
 *   npm start -- --key=你的API密钥 --provider=gemini
 *
 * 支持的 provider:
 *   - gemini   (Google Gemini) - 需要代理
 *   - openai   (OpenAI GPT) - 需要代理
 *   - claude   (Anthropic Claude) - 需要代理
 *   - qwen     (阿里通义千问) - 国内直连
 *   - deepseek (DeepSeek) - 国内直连
 *
 * 代理设置（Clash Verge 默认端口 7897）:
 *   npm start -- --key=xxx --provider=gemini --proxy=http://127.0.0.1:7897
 */

import express, { type Request, type Response as ExpressResponse } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { parseArgs } from 'node:util'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

// ==================== 命令行参数解析 ====================
const { values: args } = parseArgs({
  options: {
    key: { type: 'string', short: 'k' },
    provider: { type: 'string', short: 'P' },
    model: { type: 'string', short: 'm' },
    port: { type: 'string', short: 'p' },
    proxy: { type: 'string' },
  },
  strict: false,
})

// 仅当没有命令行参数时才加载 .env
if (!args.key && !process.env.AI_API_KEY) {
  dotenv.config()
}

// ==================== 类型定义 ====================
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GenerateRequest {
  messages: Message[]
  temperature?: number
  max_tokens?: number
  provider?: string
  model?: string
}

interface GenerationConfig {
  temperature: number
  maxTokens: number
}

type ProviderName = 'gemini' | 'openai' | 'claude' | 'qwen' | 'deepseek'

interface ProviderConfig {
  name: string
  baseUrl: string
  defaultModel: string
  models: string[]
  needsProxy: boolean
  transform: {
    request: (messages: Message[], model: string, config: GenerationConfig) => unknown
    response: (data: unknown) => string
  }
}

// ==================== 多模型配置 ====================
const PROVIDERS: Record<ProviderName, ProviderConfig> = {
  // Google Gemini
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    defaultModel: 'gemini-2.0-flash',
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    needsProxy: true,
    transform: {
      request: (messages, _model, config) => {
        const systemMsg = messages.find((m) => m.role === 'system')
        const userMsgs = messages.filter((m) => m.role !== 'system')
        return {
          contents: userMsgs.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          systemInstruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
          },
        }
      },
      response: (data: unknown) => {
        const d = data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
        return d.candidates?.[0]?.content?.parts?.[0]?.text || ''
      },
    },
  },

  // OpenAI
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    needsProxy: true,
    transform: {
      request: (messages, model, config) => ({
        model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
      response: (data: unknown) => {
        const d = data as { choices?: Array<{ message?: { content?: string } }> }
        return d.choices?.[0]?.message?.content || ''
      },
    },
  },

  // Anthropic Claude
  claude: {
    name: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    needsProxy: true,
    transform: {
      request: (messages, model, config) => {
        const systemMsg = messages.find((m) => m.role === 'system')
        const userMsgs = messages.filter((m) => m.role !== 'system')
        return {
          model,
          max_tokens: config.maxTokens,
          system: systemMsg?.content,
          messages: userMsgs.map((m) => ({ role: m.role, content: m.content })),
        }
      },
      response: (data: unknown) => {
        const d = data as { content?: Array<{ text?: string }> }
        return d.content?.[0]?.text || ''
      },
    },
  },

  // 阿里通义千问（国内直连）
  qwen: {
    name: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-turbo',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-long'],
    needsProxy: false,
    transform: {
      request: (messages, model, config) => ({
        model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
      response: (data: unknown) => {
        const d = data as { choices?: Array<{ message?: { content?: string } }> }
        return d.choices?.[0]?.message?.content || ''
      },
    },
  },

  // DeepSeek（国内直连）
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-coder'],
    needsProxy: false,
    transform: {
      request: (messages, model, config) => ({
        model,
        messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      }),
      response: (data: unknown) => {
        const d = data as { choices?: Array<{ message?: { content?: string } }> }
        return d.choices?.[0]?.message?.content || ''
      },
    },
  },
}

// ==================== 配置 ====================
const CONFIG = {
  apiKey: String(args.key || process.env.AI_API_KEY || ''),
  provider: String(args.provider || process.env.AI_PROVIDER || 'gemini') as ProviderName,
  model: String(args.model || process.env.AI_MODEL || ''),
  port: parseInt(String(args.port || process.env.PROXY_PORT || '3001'), 10),
  proxy: String(args.proxy || process.env.HTTPS_PROXY || 'http://127.0.0.1:7897'),
}

// 验证 provider
if (!PROVIDERS[CONFIG.provider]) {
  console.error(`❌ 错误: 不支持的 provider "${CONFIG.provider}"`)
  console.log(`📝 支持的 provider: ${Object.keys(PROVIDERS).join(', ')}`)
  process.exit(1)
}

// 检查 API Key
if (!CONFIG.apiKey) {
  console.error('❌ 错误: 未提供 API 密钥')
  console.log('')
  console.log('📝 使用方法:')
  console.log('   npm start -- --key=你的API密钥 --provider=gemini')
  console.log('')
  console.log('📦 支持的 provider:')
  Object.entries(PROVIDERS).forEach(([key, p]) => {
    console.log(`   ${key.padEnd(10)} - ${p.name} (${p.needsProxy ? '需要代理' : '国内直连'})`)
  })
  process.exit(1)
}

const currentProvider = PROVIDERS[CONFIG.provider]
const currentModel = CONFIG.model || currentProvider.defaultModel

// ==================== Express 服务器 ====================
const app = express()
app.use(cors())
app.use(express.json())

function buildUrl(
  providerName: ProviderName,
  provider: ProviderConfig,
  model: string,
  apiKey: string,
): string {
  switch (providerName) {
    case 'gemini':
      return `${provider.baseUrl}/${model}:generateContent?key=${apiKey}`
    case 'openai':
    case 'qwen':
    case 'deepseek':
      return `${provider.baseUrl}/chat/completions`
    case 'claude':
      return `${provider.baseUrl}/messages`
    default:
      return provider.baseUrl
  }
}

function buildHeaders(providerName: ProviderName, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  switch (providerName) {
    case 'gemini':
      break
    case 'claude':
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      break
    default:
      headers['Authorization'] = `Bearer ${apiKey}`
  }
  return headers
}

/**
 * AI 生成接口
 * POST /api/ai/generate
 */
app.post('/api/ai/generate', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const {
      messages,
      temperature = 0.7,
      max_tokens = 4096,
      provider: reqProvider,
      model: reqModel,
    } = req.body as GenerateRequest

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages 参数必须是数组' })
      return
    }

    const useProvider = (reqProvider as ProviderName) || CONFIG.provider
    const providerConfig = PROVIDERS[useProvider] || currentProvider
    const useModel =
      reqModel || (useProvider === CONFIG.provider ? currentModel : providerConfig.defaultModel)

    console.log(`[${new Date().toISOString()}] 请求 - Provider: ${useProvider}, Model: ${useModel}`)

    const url = buildUrl(useProvider, providerConfig, useModel, CONFIG.apiKey)
    const headers = buildHeaders(useProvider, CONFIG.apiKey)
    const body = providerConfig.transform.request(messages, useModel, {
      temperature,
      maxTokens: max_tokens,
    })

    let response: Response

    if (providerConfig.needsProxy && CONFIG.proxy) {
      // 使用 undici 的 ProxyAgent 进行代理请求
      console.log(`[${new Date().toISOString()}] 使用代理: ${CONFIG.proxy}`)
      const proxyAgent = new ProxyAgent(CONFIG.proxy)
      response = (await undiciFetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        dispatcher: proxyAgent,
      })) as unknown as Response
    } else {
      // 国内直连，使用原生 fetch
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[${new Date().toISOString()}] API 错误 (${response.status}):`, errorText)
      res
        .status(response.status)
        .json({ error: `API 请求失败: ${response.status}`, details: errorText })
      return
    }

    const data = await response.json()

    if ((data as { error?: { message?: string } }).error) {
      const errMsg = (data as { error: { message?: string } }).error.message || 'Unknown error'
      console.error(`[${new Date().toISOString()}] ${providerConfig.name} 错误:`, errMsg)
      res.status(500).json({ error: errMsg })
      return
    }

    const content = providerConfig.transform.response(data)
    console.log(`[${new Date().toISOString()}] 响应成功，长度: ${content.length}`)

    res.json({
      choices: [{ message: { role: 'assistant', content } }],
      provider: useProvider,
      model: useModel,
    })
  } catch (error) {
    const err = error as Error
    console.error(`[${new Date().toISOString()}] 服务器错误:`, err)
    res.status(500).json({ error: '服务器内部错误', message: err.message })
  }
})

/**
 * 获取支持的模型列表
 * GET /api/ai/models
 */
app.get('/api/ai/models', (_req: Request, res: ExpressResponse) => {
  const models = Object.entries(PROVIDERS).map(([key, p]) => ({
    provider: key,
    name: p.name,
    models: p.models,
    defaultModel: p.defaultModel,
    needsProxy: p.needsProxy,
  }))
  res.json({ models, current: { provider: CONFIG.provider, model: currentModel } })
})

/**
 * 健康检查接口
 * GET /api/health
 */
app.get('/api/health', (_req: Request, res: ExpressResponse) => {
  res.json({
    status: 'ok',
    provider: CONFIG.provider,
    providerName: currentProvider.name,
    model: currentModel,
    proxy: currentProvider.needsProxy ? CONFIG.proxy : 'not needed',
    timestamp: new Date().toISOString(),
  })
})

// ==================== 启动服务器 ====================
app.listen(CONFIG.port, () => {
  console.log('═'.repeat(55))
  console.log('🚀 AI 代理服务器已启动 (多模型版)')
  console.log('═'.repeat(55))
  console.log(`📍 地址: http://localhost:${CONFIG.port}`)
  console.log(`🤖 Provider: ${currentProvider.name}`)
  console.log(`📦 Model: ${currentModel}`)
  console.log(`🔑 API Key: ${CONFIG.apiKey.slice(0, 8)}...${CONFIG.apiKey.slice(-4)}`)
  if (currentProvider.needsProxy) {
    console.log(`🌐 代理: ${CONFIG.proxy}`)
  } else {
    console.log(`🌐 代理: 不需要 (国内直连)`)
  }
  console.log('═'.repeat(55))
  console.log('📝 API 端点:')
  console.log(`   POST http://localhost:${CONFIG.port}/api/ai/generate`)
  console.log(`   GET  http://localhost:${CONFIG.port}/api/ai/models`)
  console.log('═'.repeat(55))
  console.log('💡 支持的 Provider:')
  Object.entries(PROVIDERS).forEach(([key, p]) => {
    const tag = p.needsProxy ? '🌍' : '🇨🇳'
    console.log(`   ${tag} ${key.padEnd(10)} - ${p.name}`)
  })
  console.log('═'.repeat(55))
})
