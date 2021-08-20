import axios from 'axios'
import { debounce } from 'lodash'

import { ResolvedAssetDetails } from '@/types/assets'

import { ConsoleLogger } from './console'
import { SentryLogger } from './sentry'
import { getUserInfo } from './shared'

export type AssetEvent = {
  type: string
  storageProviderId: string
  storageProviderUrl?: string | null
} & Record<string, unknown>

class _AssetLogger {
  private logUrl = ''

  initialize(logUrl: string | null) {
    if (logUrl) this.logUrl = logUrl
  }

  private pendingEvents: AssetEvent[] = []

  private sendEvents = debounce(async () => {
    if (!this.pendingEvents.length) return
    if (!this.logUrl) return

    ConsoleLogger.debug(`Sending ${this.pendingEvents.length} asset events`)

    const payload = {
      events: this.pendingEvents,
    }
    this.pendingEvents = []

    try {
      await axios.post(this.logUrl, payload)
    } catch (e) {
      SentryLogger.error('Failed to send asset events', 'AssetLogger', e, { request: { url: this.logUrl } })
    }
  }, 2000)

  private addEvent(event: AssetEvent) {
    const eventWithUser = {
      ...event,
      user: getUserInfo(false),
    }
    this.pendingEvents.push(eventWithUser)
    this.sendEvents()
  }

  assetResponseMetric(assetDetails: ResolvedAssetDetails, responseTime: number) {
    const event: AssetEvent = {
      type: 'asset-download-response-time',
      responseTime,
      ...assetDetails,
    }
    this.addEvent(event)
  }

  assetError(assetDetails: ResolvedAssetDetails) {
    const event: AssetEvent = {
      type: 'asset-download-failure',
      ...assetDetails,
    }
    this.addEvent(event)
  }

  assetTimeout(assetDetails: ResolvedAssetDetails) {
    const event: AssetEvent = {
      type: 'asset-download-timeout',
      ...assetDetails,
    }
    this.addEvent(event)
  }
}

export const AssetLogger = new _AssetLogger()
