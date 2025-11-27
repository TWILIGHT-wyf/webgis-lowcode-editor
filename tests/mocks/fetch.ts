// axios mock helper：在单测中创建可复用的 axios 返回值
import type { AxiosResponse } from 'axios'

export function createAxiosMock(responseData: Record<string, unknown>, succeed = true) {
  const res: AxiosResponse = {
    data: responseData,
    status: succeed ? 200 : 500,
    statusText: succeed ? 'OK' : 'Error',
    headers: {} as Record<string, string>,
    config: {} as unknown as AxiosResponse['config'],
  }
  return async () => res
}

export default createAxiosMock
