import axios from 'axios'

import { ORION_AUTH_URL } from '@/config/env'

export const getUserId = async (userId?: string | null) => {
  return axios.post<{
    success: boolean
    userId: string
  }>(
    ORION_AUTH_URL,
    { ...(userId ? { userId: userId } : {}) },
    {
      method: 'POST',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
