import { axiosInstance } from '@/api/axios'
import { ORION_AUTH_URL } from '@/config/env'

type InteractionType = 'MarketplaceTokenEntry'

export const sendUserInteraction = (type: InteractionType, entityId: string) => {
  return axiosInstance.post(
    `${ORION_AUTH_URL}/register-user-interaction`,
    {
      entityId,
      type,
    },
    {
      withCredentials: true,
    }
  )
}
