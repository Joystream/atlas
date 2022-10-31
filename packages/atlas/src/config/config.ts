import { cloneDeepWith } from 'lodash-es'
import { z } from 'zod'

import { SelectItem } from '@/components/_inputs/Select'
import { createLookup } from '@/utils/data'
import { ConsoleLogger } from '@/utils/logs'

import rawConfig from '../../atlas.config.yml'

export const configSchema = z.object({
  general: z.object({
    appName: z.string(),
    appTwitterId: z.string(),
    appUrl: z.string(),
    appGithubUrl: z.string(),
    pioneerMemberUrlPrefix: z.string(),
    joystreamLandingPageUrl: z.string(),
    joystreamDiscordUrl: z.string(),
  }),
  storage: z.object({
    assetResponseTimeout: z.number(),
    assetUploadStatusPollingInterval: z.number(),
    uploadProcessingTimeout: z.number(),
    minimumDistributorRefetchTime: z.number(),
    geolocationServiceUrl: z.string().nullable(),
    channelBagPrefix: z.string(),
    uploadPath: z.string(),
    assetPath: z.string(),
  }),
  joystream: z.object({
    tokenTicker: z.string(),
    tokenPriceFeedUrl: z.string().nullable(),
    alternativeNodes: z.array(z.object({ url: z.string(), name: z.string() })),
  }),
  features: z.object({
    nft: z.object({
      auctionMinimumBidStepMultiplier: z.number(),
      openAuctionBidLockDuration: z.number(),
      englishAuctionExtensionPeriod: z.number(),
      statusPollingInterval: z.number(),
    }),
    notifications: z.object({ pollingInterval: z.number() }),
    members: z.object({
      avatarServiceUrl: z.string(),
      hcaptchaSiteKey: z.string().nullable(),
    }),
    playback: z.object({ playbackRates: z.array(z.number()) }),
    comments: z.object({
      reactions: z.array(z.object({ id: z.number(), emoji: z.string(), name: z.string() })),
    }),
  }),
  content: z.object({
    blockedDataObjectIds: z.array(z.string()),
    blockedVideoIds: z.array(z.string()),
    blockedChannelIds: z.array(z.string()),
    officialJoystreamChannelId: z.string().nullable(),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        iconUrl: z.string(),
        coverImgUrl: z.string(),
        videoCategories: z.array(z.string()),
        defaultVideoCategory: z.string(),
      })
    ),
    showAllContent: z.boolean(),
    languages: z.array(z.object({ isoCode: z.string(), name: z.string() })),
  }),
  analytics: z.object({
    assetLogs: z
      .object({
        url: z.string().nullable(),
      })
      .nullable(),
    sentry: z
      .object({
        dsn: z.string().nullable(),
      })
      .nullable(),
    livesession: z
      .object({
        id: z.string().nullable(),
        rootHostname: z.string().nullable(),
      })
      .nullable(),
    usersnap: z
      .object({
        id: z.string().nullable(),
      })
      .nullable(),
  }),
  legal: z.object({
    termsOfService: z.string(),
    copyrightPolicy: z.string(),
  }),
})
export type RawConfig = z.infer<typeof configSchema>
type Config = RawConfig & {
  derived: {
    languagesLookup: Record<string, string>
    languagesSelectValues: SelectItem[]
    commentReactionsLookup: Record<number, RawConfig['features']['comments']['reactions'][number]>
  }
}

let parsedConfig: RawConfig

try {
  const configWithEnv = cloneDeepWith(rawConfig, (value) => {
    if (typeof value === 'string') {
      const match = value.match(/^\$(.*)$/)
      if (!match) return
      const envVar = match[1]
      const envValue = import.meta.env[envVar]
      return envValue ?? null
    }
  })
  parsedConfig = configSchema.parse(configWithEnv)
} catch (e) {
  ConsoleLogger.error('Failed to parse app config', e)
  throw e
}

const extendedConfig: Config = {
  ...parsedConfig,
  derived: {
    languagesLookup: parsedConfig.content.languages.reduce((acc, { isoCode, name }) => {
      acc[isoCode] = name
      return acc
    }, {} as Record<string, string>),
    languagesSelectValues: parsedConfig.content.languages.map(({ isoCode, name }) => ({
      name: name,
      value: isoCode,
    })),
    commentReactionsLookup: createLookup(parsedConfig.features.comments.reactions),
  },
}

export const atlasConfig = Object.freeze(extendedConfig)
