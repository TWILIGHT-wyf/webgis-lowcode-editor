import { Router, type Request, type Response } from 'express'
import { ProxyAgent, fetch as undiciFetch } from 'undici'

const router = Router()

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

// 配置
const AI_CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  provider: (process.env.AI_PROVIDER || 'gemini') as ProviderName,
  model: process.env.AI_MODEL || '',
  proxy: process.env.HTTPS_PROXY,
}

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

// AI 生成接口
router.post('/generate', async (req: Request, res: Response): Promise<void> => {
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

    if (!AI_CONFIG.apiKey) {
      res.status(500).json({ error: '服务器未配置 AI API Key' })
      return
    }

    const useProvider = (reqProvider as ProviderName) || AI_CONFIG.provider
    const providerConfig = PROVIDERS[useProvider]
    if (!providerConfig) {
      res.status(400).json({ error: `不支持的 provider: ${useProvider}` })
      return
    }

    const currentProvider = PROVIDERS[AI_CONFIG.provider]
    const useModel =
      reqModel ||
      (useProvider === AI_CONFIG.provider
        ? AI_CONFIG.model || currentProvider.defaultModel
        : providerConfig.defaultModel)

    console.log(`[AI] ${useProvider}/${useModel} - ${messages.length} messages`)

    const url = buildUrl(useProvider, providerConfig, useModel, AI_CONFIG.apiKey)
    const headers = buildHeaders(useProvider, AI_CONFIG.apiKey)
    const body = providerConfig.transform.request(messages, useModel, {
      temperature,
      maxTokens: max_tokens,
    })

    const dispatcher =
      providerConfig.needsProxy && AI_CONFIG.proxy ? new ProxyAgent(AI_CONFIG.proxy) : undefined

    const response = await undiciFetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      dispatcher,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[AI] Error ${response.status}:`, errorText)
      res
        .status(response.status)
        .json({ error: `AI API 错误: ${response.status}`, details: errorText })
      return
    }

    const data = await response.json()
    const content = providerConfig.transform.response(data)

    res.json({
      choices: [{ message: { role: 'assistant', content } }],
      provider: useProvider,
      model: useModel,
    })
  } catch (error) {
    console.error('[AI] Error:', error)
    res.status(500).json({ error: '服务器内部错误', message: (error as Error).message })
  }
})

// 获取支持的模型列表
router.get('/models', (_req: Request, res: Response) => {
  const models = Object.entries(PROVIDERS).map(([key, p]) => ({
    provider: key,
    name: p.name,
    models: p.models,
    defaultModel: p.defaultModel,
    needsProxy: p.needsProxy,
  }))
  const currentProvider = PROVIDERS[AI_CONFIG.provider]
  res.json({
    models,
    current: {
      provider: AI_CONFIG.provider,
      model: AI_CONFIG.model || currentProvider?.defaultModel,
    },
  })
})

export default router
