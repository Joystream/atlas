import { z } from 'zod'

// keep config schema in separate file so it can be imported without relying on YAML plugin
const YppTierEnum = z.enum(['bronze', 'silver', 'gold', 'diamond'])
const YppWidgetIconEnum = z.enum(['info', 'message', 'tokenStack'])

export const configSchema = z.object({
  general: z.object({
    appId: z.string().nullable(),
    appName: z.string(),
    appDescription: z.string(),
    appTagline: z.string().optional(),
    appTwitterId: z.string(),
    appUrl: z.string(),
    appGithubUrl: z.string(),
    appOgImgPath: z.string(),
    pioneerMemberUrlPrefix: z.string(),
    joystreamLandingPageUrl: z.string(),
    joystreamDiscordUrl: z.string(),
    appContentFocus: z.string().nullable(),
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
    ypp: z.object({
      suspensionReasonsLink: z.string().nullable(),
      yppDelayThreshold: z.number().nullable(),
      googleConsoleClientId: z.string().nullable(),
      youtubeSyncApiUrl: z.string().nullable(),
      suspendedSupportLink: z.string().nullable(),
      suspendedLinkText: z.string().nullable(),
      youtubeCollaboratorMemberId: z.string().nullable(),
      landingPageOgTitle: z.string().nullable(),
      landingPageOgDescription: z.string().nullable(),
      landingPageOgImgPath: z.string().nullable(),
      enrollmentReward: z.number().nullable(),
      enrollmentUsdReward: z.number().nullable(),
      referralBaseReward: z.number().nullable(),
      dailySignupQuota: z.number().nullable(),
      tiersDefinition: z.array(
        z.object({
          tier: YppTierEnum,
          reqs: z.array(z.string()),
          rewards: z.array(z.number()).max(3),
        })
      ),
      rewards: z
        .array(
          z.object({
            title: z.string(),
            showInDashboard: z.boolean().optional().default(true),
            shortDescription: z.string(),
            stepsDescription: z.string().optional(),
            steps: z.array(z.string()).optional(),
            baseAmount: z
              .union([
                z.number(),
                z.array(z.number()),
                z.object({
                  min: z.number(),
                  max: z.number(),
                }),
              ])
              .nullable(),
            baseUsdAmount: z
              .union([
                z.number(),
                z.array(z.number()),
                z.object({
                  min: z.number().nullable(),
                  max: z.number(),
                }),
              ])
              .nullable(),
            customMultiplier: z.array(z.number()).optional(),
            actionButtonText: z.string().optional(),
            actionButtonAction: z
              .string()
              .refine((value) => value.match(/^\//gi) || value === 'copyReferral')
              .optional(),
          })
        )
        .optional(),
      widgets: z
        .array(
          z.object({
            title: z.string(),
            link: z.string(),
            linkText: z.string().optional(),
            label: z.string().optional(),
            icon: YppWidgetIconEnum.optional(),
          })
        )
        .optional(),
      legal: z.object({
        yppTnC: z.string(),
      }),
    }),
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
      .optional(),
    usersnap: z
      .object({
        id: z.string().nullable(),
      })
      .optional(),
    GA: z
      .object({
        id: z.string().nullable(),
      })
      .optional(),
    optimize: z
      .object({
        id: z.string().nullable(),
      })
      .optional(),
    segment: z
      .object({
        id: z.string().nullable(),
      })
      .optional(),
  }),
  legal: z.object({
    termsOfService: z.string(),
    copyrightPolicy: z.string(),
    privacyPolicy: z.string(),
  }),
})

export type RawConfig = z.infer<typeof configSchema>
export type YppWidgetIcons = z.infer<typeof YppWidgetIconEnum>
