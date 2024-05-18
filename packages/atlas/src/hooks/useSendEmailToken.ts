import { useMutation } from 'react-query'

import { axiosInstance } from '@/api/axios'
import { ORION_AUTH_URL } from '@/config/env'
import { isAxiosError } from '@/utils/error'

// code 400: Request is malformatted or provided e-mail address is not valid.
// code 429: Too many requests for a new token sent within a given timeframe.

export enum SendEmailTokenErrors {
  INVALID_EMAIL = 'INVALID_EMAIL',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
}

export const useSendEmailToken = () => {
  return useMutation({
    mutationFn: (email: string) =>
      axiosInstance
        .post(
          `${ORION_AUTH_URL}/request-email-confirmation-token`,
          {
            email,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .catch((e) => {
          if (isAxiosError(e)) {
            const code = e.response?.status
            if (code === 400) {
              throw new Error(SendEmailTokenErrors.INVALID_EMAIL)
            }
            if (code === 429) {
              throw new Error(SendEmailTokenErrors.TOO_MANY_REQUESTS)
            }
          }

          throw e
        }),
  })
}
