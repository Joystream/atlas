import axios, { AxiosError } from 'axios'

export function isAxiosError<ResponseType>(error: unknown): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error)
}
