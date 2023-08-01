import axios from 'axios'

export const axiosInstance = axios.create({
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (response) => {
    if (response.config.data) {
      response.errorData = JSON.stringify(response.config.data)
    }
    response.endpoint = response.config.url
    throw response
  }
)
