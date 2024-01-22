import { axiosInstance } from '@/api/axios'
import { ORION_INTERACTIONS_URL } from '@/config/env'

type ClickOptions = {
  recommId?: string
  duration?: number
}

type ConsummationOptions = {
  recommId?: string
}

type PortionOptions = {
  recommId?: string
  portion: number
}

class _InteractionsService {
  private uri = ''
  constructor(serviceUri?: string) {
    this.uri = serviceUri ?? ORION_INTERACTIONS_URL
  }

  async videoConsumed(videoId: string, options?: ConsummationOptions) {
    return axiosInstance.post(
      `${this.uri}/video-consumed`,
      {
        recommId: options?.recommId,
        itemId: videoId,
      },
      { withCredentials: true }
    )
  }

  async videoPortion(videoId: string, { recommId, portion }: PortionOptions) {
    return axiosInstance.post(
      `${this.uri}/video-portion`,
      {
        recommId,
        portion,
        itemId: videoId,
      },
      { withCredentials: true }
    )
  }

  async videoClicked(videoId: string, options?: ClickOptions) {
    return axiosInstance.post(
      `${this.uri}/video-clicked`,
      {
        duration: options?.duration,
        recommId: options?.recommId,
        itemId: videoId,
      },
      { withCredentials: true }
    )
  }

  async channelClicked(channelId: string, options?: ClickOptions) {
    return axiosInstance.post(
      `${this.uri}/channel-clicked`,
      {
        duration: options?.duration,
        recommId: options?.recommId,
        itemId: channelId,
      },
      { withCredentials: true }
    )
  }
}

export const InteractionsService = new _InteractionsService()
