import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data === 'Token expired' &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true

      try {
        await api.post(
          '/refresh-token',
          {},
          {
            withCredentials: true,
          },
        )

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export { api }
