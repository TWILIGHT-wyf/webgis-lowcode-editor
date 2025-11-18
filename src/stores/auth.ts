import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginRequest, LoginResponse, User } from '@/type/auth'
import http from '@/services/http'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User>()
  const isAuth = computed(() => !!token.value)
  const router = useRouter()
  const login = async (req: LoginRequest): Promise<void> => {
    try {
      const { data } = await http.post<LoginResponse>('/auth/login', req)
      token.value = data.accessToken
      localStorage.setItem('token', token.value)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:',error)
    }
  }
  const loadFromToken = async (): Promise<void> => {
    token.value = localStorage.getItem('token')
    if(!token.value) return
    try {
      const { data } = await http.get<User>('/auth/me')
      user.value = data
    } catch (error) {
      console.error('failed get user:', error)
      token.value = null
      localStorage.removeItem('token')
    }
  }
  const init = async (): Promise<void> => {
    await loadFromToken()
    if (isAuth.value) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return {
    isAuth,
    token,
    user,
    login,
    loadFromToken,
    init
  }
})
