// tests/mocks/axios.ts
// 简单的 axios mock，导出一个对象包含 get/post 等方法

const axios = {
  get: (url: string) => {
    return Promise.resolve({ data: { url, data: [1, 2, 3] } })
  },
  post: (url: string, payload: Record<string, unknown>) => {
    return Promise.resolve({ data: { url, payload } })
  },
}

// 在全局注册，方便在测试中直接使用 (大多数项目会通过 jest/vitest mock 实现)
;(globalThis as unknown as { axios: typeof axios }).axios = axios

export default axios
