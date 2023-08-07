import { debounce } from 'lodash-es'

import { axiosInstance } from '@/api/axios'
import { DataObjectType } from '@/api/queries/__generated__/baseTypes.generated'

import { ConsoleLogger } from './console'
import { SentryLogger } from './sentry'

type DistributorEventDetails = {
  distributorId?: string
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
  dataObjectType: DataObjectType['__typename']
  resolvedUrl: string
} & DistributorEventDetails

export type DataObjectResponseMetric = {
  initialResponseTime: number
  fullResponseTime?: number
}

class _AssetLogger {
  private logUrl = ''
  private user?: Record<string, unknown>

  initialize(logUrl: string | undefined | null) {
    if (!logUrl) return

    // increase the size of performance entry buffer, so we don't skip any assets
    window.performance.setResourceTimingBufferSize(1000)

    this.logUrl = logUrl
  }

  setUser(user?: Record<string, unknown>) {
    this.user = user
  }

  get isEnabled() {
    return !!this.logUrl
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
      await axiosInstance.post(this.logUrl, payload)
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

  logDistributorResponseTime(entry: DistributorEventEntry, metric: DataObjectResponseMetric) {
    const event: StorageEvent = {
      type: 'distributor-response-time',
      ...entry,
      ...metric,
    }
    this.addEvent(event)
  }

  logDistributorError(entry: DistributorEventEntry) {
    const event: StorageEvent = {
      type: 'distributor-response-error',
      ...entry,
    }
    this.addEvent(event)
  }

  logDistributorResponseTimeout(entry: DistributorEventEntry) {
    const event: StorageEvent = {
      type: 'distributor-response-timeout',
      ...entry,
    }
    this.addEvent(event)
  }
}

export const AssetLogger = new _AssetLogger()
