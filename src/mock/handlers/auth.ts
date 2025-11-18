import { http, HttpResponse } from 'msw'
import { mockUsers } from '../data/user'
import type { LoginRequest, LoginResponse, User } from '@/type/auth'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }): Promise<Response> => {
    try {
      const body = (await request.json()) as LoginRequest
      const { username, password } = body
      const user: User | undefined = mockUsers.find((u) => u.username === username)
      if (user && password === '123456') {
        const response: LoginResponse = {
          accessToken: 'mockToken',
          user,
        }
        return HttpResponse.json(response, { status: 200 })
      }
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    } catch (error) {
      console.error(error)
      return HttpResponse.text('Bad Request', { status: 400 })
    }
  }),
  http.get('/api/auth/me', async ({ request }): Promise<Response> => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'No token' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    if (token === 'mockToken') {
      const user: User = mockUsers[0] as User
      return HttpResponse.json(user, { status: 200 })
    }
    return HttpResponse.json({ message: 'Invalid token' }, { status: 401 })
  }),
]
