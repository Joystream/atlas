import { throttle } from 'lodash-es'

import { axiosInstance } from '@/api/axios'
import { DataObjectType } from '@/api/queries/__generated__/baseTypes.generated'
import { NftIssuanceInputMetadata } from '@/joystream-lib/types'
import { AssetType } from '@/providers/uploads/uploads.types'

import { ConsoleLogger } from './console'
import { SentryLogger } from './sentry'

type DistributorEventDetails = {
  distributorId?: string
  distributorUrl?: string | null
}

export type DistributorEventMetric = {
  initialResponseTime?: number
  fullResponseTime?: number
  downloadSpeed?: number
}

type UserPerformanceEvent = UserLogEvent

type ErrorEvent = UserErrorEvent | DistributorErrorEvent

type UserErrorEvent = {
  error?: string
  details?: {
    [key: string]: unknown
  }
} & UserLogEvent

type DistributorErrorEvent = {
  error?: string
  details?: {
    [key: string]: unknown
  }
} & DistributorEventEntry

type UserLogEvent = {
  type: string
  userDevice?: string
  user?: Record<string, unknown>
  [x: string]: unknown
}

export type DistributorEventEntry = {
  dataObjectId?: string | null
  dataObjectType?: DataObjectType['__typename'] | AssetType
  resolvedUrl?: string
} & DistributorEventDetails

type CodecInfo = {
  assetType: string | null
  codec?: string
}

class _UserEventsLogger {
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

  private pendingPerformanceEvents: UserPerformanceEvent[] = []
  private pendingErrorEvents: ErrorEvent[] = []

  private sendPerformanceEvents = throttle(async () => {
    if (!this.pendingPerformanceEvents.length) return

    ConsoleLogger.debug(`Sending ${this.pendingPerformanceEvents.length} performance events`)

    const payload = {
      events: this.pendingPerformanceEvents,
    }
    this.pendingPerformanceEvents = []

    try {
      await axiosInstance.post(this.logUrl, payload)
    } catch (e) {
      SentryLogger.error('Failed to send performance events', 'UserEventsLogger', e)
    }
  }, 60 * 1000)

  private sendErrorEvents = throttle(async () => {
    if (!this.pendingErrorEvents.length) return

    ConsoleLogger.debug(`Sending ${this.pendingErrorEvents.length} error events`)

    const payload = {
      events: this.pendingErrorEvents,
    }
    this.pendingErrorEvents = []

    try {
      await axiosInstance.post(this.logUrl, payload)
    } catch (e) {
      SentryLogger.error('Failed to send asset events', 'UserEventsLogger', e)
    }
  }, 5 * 1000)

  private addPerformanceEvent(event: UserPerformanceEvent | UserLogEvent) {
    const eventWithUser = {
      ...event,
      user: this.user,
    }
    this.pendingPerformanceEvents.push(eventWithUser)
    this.sendPerformanceEvents()
  }
  private addErrorEvent(event: ErrorEvent) {
    const eventWithUser = {
      ...event,
      user: this.user,
    }
    this.pendingErrorEvents.push(eventWithUser)
    this.sendErrorEvents()
  }

  logDistributorResponseTime(entry: DistributorEventEntry, metric: DistributorEventMetric) {
    const event: UserPerformanceEvent = {
      type: 'distributor-response-time',
      ...entry,
      ...metric,
    }
    this.addPerformanceEvent(event)
  }

  logDistributorError(entry: DistributorEventEntry, error: Error) {
    const event: UserLogEvent = {
      type: 'distributor-response-error',
      ...entry,
      error: error.message,
    }
    this.addErrorEvent(event)
  }

  logDistributorResponseTimeout(entry: DistributorEventEntry) {
    const event: UserPerformanceEvent = {
      type: 'distributor-response-timeout',
      ...entry,
    }
    this.addPerformanceEvent(event)
  }

  logDistributorBlacklistedEvent(entry: DistributorEventEntry) {
    const event: UserLogEvent = {
      type: 'distributor-blacklisted',
      ...entry,
    }
    this.addErrorEvent(event)
  }

  logPlaybackIsSlowEvent(entry: DistributorEventEntry) {
    const event: UserPerformanceEvent = {
      type: 'playback-is-slow',
      ...entry,
    }
    this.addPerformanceEvent(event)
  }

  logWrongCodecEvent(entry: DistributorEventEntry, info: CodecInfo) {
    const event: UserLogEvent = {
      type: 'playback-wrong-codec',
      ...entry,
      ...info,
    }
    this.addErrorEvent(event)
  }

  logAssetUploadFailedEvent(entry: DistributorEventEntry, error: Error) {
    const event: UserLogEvent = {
      type: 'asset-upload-failed',
      ...entry,
      error: error.message,
    }
    this.addErrorEvent(event)
  }

  logMissingOperatorsForBag(storageBagId: string) {
    const event: UserLogEvent = {
      type: 'missing-operators-for-bag',
      storageBagId,
    }
    this.addErrorEvent(event)
  }

  logNftMintingFailedEvent(nft?: NftIssuanceInputMetadata, error?: Error) {
    const event: UserLogEvent = {
      type: 'nft-minting-failed',
      details: {
        nft,
      },
      error: error?.message,
    }
    this.addErrorEvent(event)
  }

  logFundsWithdrawal(channelId: string, amount: string) {
    const event: UserLogEvent = {
      type: 'funds-withdrawal',
      channelId,
      amount,
    }
    this.addPerformanceEvent(event)
  }

  logUserBenchmarkTime(time: number) {
    const event: UserLogEvent = {
      type: 'user-statistics-benchmark-time',
      time,
    }
    this.addPerformanceEvent(event)
  }

  logUserError(type: string, error: Record<string, unknown>) {
    const event: UserLogEvent = {
      type,
      ...error,
    }
    this.addErrorEvent(event)
  }

  logUserEvent(type: string, details: Record<string, unknown>) {
    const event: UserLogEvent = {
      type,
      ...details,
    }
    this.addPerformanceEvent(event)
  }
}

export const UserEventsLogger = new _UserEventsLogger()
