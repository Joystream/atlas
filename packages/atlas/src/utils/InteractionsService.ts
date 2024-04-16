import { axiosInstance } from '@/api/axios'
import { ORION_INTERACTIONS_URL } from '@/config/env'

type ConsummationOptions = {
  recommId?: string | null
}

type ClickOptions = {
  duration?: number
} & ConsummationOptions

type PortionOptions = {
  portion: number
} & ConsummationOptions

class _InteractionsService {
  private uri = ''
  private _enabled = false
  constructor(serviceUri?: string) {
    this.uri = serviceUri ?? ORION_INTERACTIONS_URL
    if (this.uri) {
      this._enabled = true
    }
  }

  get isEnabled() {
    return this._enabled
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
