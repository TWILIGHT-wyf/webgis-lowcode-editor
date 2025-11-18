import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    if (auth.token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${auth.token}`,
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)
export default http
