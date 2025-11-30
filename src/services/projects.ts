import http from './http'

export interface ProjectPayload {
  name: string
  description?: string
  data?: Record<string, unknown>
}

export async function listProjects() {
  const res = await http.get('/projects')
  return res.data?.projects || []
}

export async function getProject(id: string) {
  const res = await http.get(`/projects/${id}`)
  return res.data?.project
}

export async function createProject(payload: ProjectPayload) {
  const res = await http.post('/projects', payload)
  return res.data?.project
}

export async function updateProject(id: string, payload: Partial<ProjectPayload>) {
  const res = await http.put(`/projects/${id}`, payload)
  return res.data?.project
}

export async function deleteProject(id: string) {
  const res = await http.delete(`/projects/${id}`)
  return res.data
}

export default {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
}
