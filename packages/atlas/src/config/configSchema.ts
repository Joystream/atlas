import { z } from 'zod'

// keep config schema in separate file so it can be imported without relying on YAML plugin

export const configSchema = z.object({
  general: z.object({
    appName: z.string(),
    appDescription: z.string(),
    appTwitterId: z.string(),
    appUrl: z.string(),
    appGithubUrl: z.string(),
    appOgImgPath: z.string(),
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
    popularLanguages: z.array(z.string()),
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
    privacyPolicy: z.string(),
  }),
})
export type RawConfig = z.infer<typeof configSchema>
