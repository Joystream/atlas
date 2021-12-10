import axios from 'axios'
import { debounce } from 'lodash-es'

import { DataObjectType } from '@/types/storage'

import { ConsoleLogger } from './console'
import { SentryLogger } from './sentry'

type DistributorEventDetails = {
  distributorId: string
  distributorUrl?: string | null
}

type StorageProviderEventDetails = {
  storageProviderId: string
  storageProviderUrl?: string | null
}

type StorageEvent = {
  type: string
  [x: string]: unknown
} & (DistributorEventDetails | StorageProviderEventDetails)

export type DistributorEventEntry = {
  dataObjectId: string
  dataObjectType: DataObjectType
} & DistributorEventDetails

class _AssetLogger {
  private logUrl = ''
  private user?: Record<string, unknown>

  initialize(logUrl: string | null) {
    if (logUrl) this.logUrl = logUrl
  }

  setUser(user?: Record<string, unknown>) {
    this.user = user
  }

  private pendingEvents: StorageEvent[] = []

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

  private addEvent(event: StorageEvent) {
    const eventWithUser = {
      ...event,
      user: this.user,
    }
    this.pendingEvents.push(eventWithUser)
    this.sendEvents()
  }

  assetResponseMetric(entry: DistributorEventEntry, responseTime: number) {
    const event: StorageEvent = {
      type: 'asset-download-response-time',
      responseTime,
      ...entry,
    }
    this.addEvent(event)
  }

  assetError(entry: DistributorEventEntry) {
    const event: StorageEvent = {
      type: 'asset-download-failure',
      ...entry,
    }
    this.addEvent(event)
  }

  assetTimeout(entry: DistributorEventEntry) {
    const event: StorageEvent = {
      type: 'asset-download-timeout',
      ...entry,
    }
    this.addEvent(event)
  }

  // uploadError(entry: DistributorEventEntry) {
  //   const event: StorageEvent = {
  //     type: 'asset-upload-failure',
  //     ...entry,
  //   }
  //   this.addEvent(event)
  // }
  //
  // uploadRequestMetric(assetDetails: ResolvedAssetDetails, uploadTime: number, fileSize: number) {
  //   const event: StorageEvent = {
  //     type: 'asset-upload-request-time',
  //     ...assetDetails,
  //     uploadTime,
  //     fileSize,
  //   }
  //   this.addEvent(event)
  // }
}

export const AssetLogger = new _AssetLogger()
