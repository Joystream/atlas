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
    channelBagPrefix: z.string(),
    uploadPath: z.string(),
    assetPath: z.string(),
  }),
  joystream: z.object({
    tokenTicker: z.string(),
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
    playback: z.object({ playbackRates: z.array(z.number()) }),
    comments: z.object({
      reactions: z.array(z.object({ id: z.number(), emoji: z.string(), name: z.string() })),
    }),
  }),
  content: z.object({
    blockedDataObjectIds: z.array(z.string()),
    blockedVideoIds: z.array(z.string()),
    blockedChannelIds: z.array(z.string()),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
        iconUrl: z.string(),
        coverImgUrl: z.string(),
        videoCategories: z.array(z.string()),
      })
    ),
    languages: z.array(z.object({ isoCode: z.string(), name: z.string() })),
  }),
})
type RawConfig = z.infer<typeof configSchema>
type Config = RawConfig & {
  derived: {
    languagesLookup: Record<string, string>
    languagesSelectValues: SelectItem[]
    commentReactionsLookup: Record<number, RawConfig['features']['comments']['reactions'][number]>
  }
}

let parsedConfig: RawConfig

try {
  parsedConfig = configSchema.parse(rawConfig)
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
