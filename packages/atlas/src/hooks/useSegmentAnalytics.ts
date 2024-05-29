import { useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useSegmentAnalyticsContext } from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'
import { YppRequirementsErrorCode } from '@/views/global/YppLandingView/YppAuthorizationModal/YppAuthorizationModal.types'

export type videoPlaybackParams = {
  videoId: string
  channelId: string
  title: string
  category: string
  totalLength: number
  fullScreen: boolean
  quality: string
  isNft?: boolean
}

type PageViewParams = {
  referrerChannel?: string
  tab?: string
  utm_source?: string
  utm_campaign?: string
  utm_content?: string
  isYppFlow?: boolean
} & VideoPageViewParams &
  ChannelPageViewParams

type VideoPageViewParams = {
  videoId?: string
  videoTitle?: string
  isNft?: boolean
  category?: string
}

type ChannelPageViewParams = {
  channelId?: string
  channelName?: string
}

type AllNftFilters = {
  priceFrom?: number
  priceTo?: number
  status?: string
  sortBy?: string
}

type YppOptInParams = {
  handle?: string
  email?: string
  category?: string
  subscribersCount?: string
  referrerId?: string
  utmSource?: string
  utmCampaign?: string
  utmContent?: string
}

type IdentifyUserParams = {
  name: string
  email: string
  memberId: string
  isYppFlow?: string
  signInType?: string
}

type playbackEventType = 'playbackStarted' | 'playbackPaused' | 'playbackResumed' | 'playbackCompleted'

export const useSegmentAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()
  const [searchParams] = useSearchParams()

  const playbackEventsQueue = useRef<{ type: playbackEventType; params: videoPlaybackParams }[]>([])

  const getUTMParams = useCallback(() => {
    const [referrer, utmSource, utmCampaign, utmContent] = [
      searchParams.get('referrerId'),
      searchParams.get('utm_source'),
      searchParams.get('utm_campaign'),
      searchParams.get('utm_content'),
    ]
    return { referrer, utm_source: utmSource, utm_campaign: utmCampaign, utm_content: utmContent }
  }, [searchParams])

  const identifyUser = useCallback(
    (params: IdentifyUserParams) => {
      analytics.identify(params.email, { ...params, ...getUTMParams() })
    },
    [analytics, getUTMParams]
  )

  const trackPageView = useCallback(
    (name: string, params?: PageViewParams) => {
      analytics.page(undefined, name, { ...params, ...getUTMParams() })
    },
    [analytics, getUTMParams]
  )

  const trackYppOptIn = useCallback(
    ({ handle, email, category, subscribersCount, referrerId, utmSource, utmCampaign, utmContent }: YppOptInParams) => {
      analytics.track('YPP Sign Up Completed', {
        handle,
        email,
        category,
        subscribersCount,
        referrerId,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      })
    },
    [analytics]
  )

  const trackMembershipCreation = useCallback(
    (handle: string, email: string) => {
      analytics.track('Membership created', {
        handle,
        email,
        ...getUTMParams(),
      })
    },
    [analytics, getUTMParams]
  )

  const trackChannelCreation = useCallback(
    (channelId: string, channelTitle: string, language: string) => {
      analytics.track('Channel created', {
        channelId,
        channelTitle,
        language,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackStarted = useCallback(
    async (params: videoPlaybackParams) => {
      await analytics.track('Video playback started', {
        ...params,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackPaused = useCallback(
    async (params: videoPlaybackParams) => {
      await analytics.track('Video playback paused', {
        ...params,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackResumed = useCallback(
    async (params: videoPlaybackParams) => {
      await analytics.track('Video playback resumed', {
        ...params,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackCompleted = useCallback(
    async (params: videoPlaybackParams) => {
      await analytics.track('Video playback completed', {
        ...params,
      })
    },
    [analytics]
  )

  const trackVideoUpload = useCallback(
    (title: string, channelId: string) => {
      analytics.track('Video uploaded', {
        channelId,
        title,
      })
    },
    [analytics]
  )

  const trackNftMint = useCallback(
    (title: string, channelId: string) => {
      analytics.track('NFT minted', {
        title,
        channelId,
      })
    },
    [analytics]
  )

  const trackNftSale = useCallback(
    (saleType: string, price: string) => {
      analytics.track('NFT put on sale', {
        saleType,
        price,
      })
    },
    [analytics]
  )

  const trackClickTopBarSignInButton = useCallback(() => {
    analytics.track('Top Nav Sign In Clicked', { ...getUTMParams() })
  }, [analytics, getUTMParams])

  const trackClickAuthModalSignInButton = useCallback(() => {
    analytics.track('YPP Reqs Modal - Sign In Clicked', { ...getUTMParams() })
  }, [analytics, getUTMParams])

  const trackClickAuthModalSignUpButton = useCallback(() => {
    analytics.track('YPP Reqs Modal - Create Account Clicked', { ...getUTMParams() })
  }, [analytics, getUTMParams])

  const trackCommentAdded = useCallback(
    (commentBody: string, videoId: string) => {
      analytics.track('Comment added', {
        commentBody,
        videoId,
      })
    },
    [analytics]
  )

  const trackLikeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('Like added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const trackDislikeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('Dislike added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const trackChannelFollow = useCallback(
    (channelId: string) => {
      analytics.track('Channel followed', {
        channelId,
      })
    },
    [analytics]
  )

  const trackYppSignInButtonClick = useCallback(() => {
    analytics.track('YPP Landing Sign In w Google Clicked', {
      ...getUTMParams(),
    })
  }, [analytics, getUTMParams])

  const trackRewardsCreateChannelButtonClick = useCallback(() => {
    analytics.track('YPP Landing Create Channel Clicked', {
      ...getUTMParams(),
    })
  }, [analytics, getUTMParams])

  const trackNFTCarouselNext = useCallback(
    (slideId: string, nftId?: string) => {
      analytics.track('Featured NFT carousel next slide', {
        slideId,
        nftId,
      })
    },
    [analytics]
  )

  const trackNFTCarouselPrev = useCallback(
    (slideId: string, nftId?: string) => {
      analytics.track('Featured NFT carousel next slide', {
        slideId,
        nftId,
      })
    },
    [analytics]
  )

  const trackFeaturedNFTNext = useCallback(
    (page?: string) => {
      analytics.track('Featured NFT next page', {
        page,
      })
    },
    [analytics]
  )

  const trackFeaturedNFTPrev = useCallback(
    (page?: string) => {
      analytics.track('Featured NFT prev page', {
        page,
      })
    },
    [analytics]
  )

  const trackAllNftFilterUpdated = useCallback(
    ({ priceFrom, priceTo, status, sortBy }: AllNftFilters) => {
      analytics.track('All NFTs section filter updated', {
        status,
        priceFrom,
        priceTo,
        sortBy,
      })
    },
    [analytics]
  )

  const trackWithdrawnFunds = useCallback(
    (channelId?: string, amount?: string, toOwnMembership?: boolean) => {
      analytics.track('Funds withdrawal', {
        channelId,
        amount,
        toOwnMembership,
      })
    },
    [analytics]
  )

  const trackReferralLinkGenerated = useCallback(
    (channelId: string | null | undefined) => {
      analytics.track('Referral link generated', {
        channelId,
      })
    },
    [analytics]
  )

  const trackLivesessionRecording = useCallback(
    (url: string | null | undefined) => {
      analytics.track('Livesession recording', {
        url,
      })
    },
    [analytics]
  )

  const trackUploadVideoClicked = useCallback(
    (channelId: string | null | undefined) => {
      analytics.track('Studio - Upload Video Clicked', { channelId })
    },
    [analytics]
  )

  const trackPublishAndUploadClicked = useCallback(
    (channelId: string | null | undefined) => {
      analytics.track('Video - Publish and Upload Clicked', { channelId })
    },
    [analytics]
  )

  const trackYppReqsNotMet = useCallback(
    (
      errors: YppRequirementsErrorCode[],
      utmSource: string | null | undefined,
      utmCampaign: string | null | undefined,
      utmContent: string | null | undefined
    ) => {
      analytics.track('YPP Sign Up Failed - Reqs Not Met', {
        errors,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      })
    },
    [analytics]
  )

  const trackLogout = useCallback(() => {
    analytics.reset()
  }, [analytics])

  /// CRT events

  const trackTokenMintingStarted = useCallback(
    (channelId: string) => {
      analytics.track('Token minting flow started', {
        channelId,
      })
    },
    [analytics]
  )

  const trackTokenMintingCompleted = useCallback(
    (channelId: string, tokenId: string, tokenTicker: string, initSupply: number, safetyOption: string) => {
      analytics.track('Token minting completed', {
        channelId,
        tokenId,
        tokenTicker,
        initSupply,
        safetyOption,
      })
    },
    [analytics]
  )

  const trackAMMStarted = useCallback(
    (tokenId: string, tokenTicker: string, channelId: string) => {
      analytics.track('Token Market Opened', {
        tokenId,
        tokenTicker,
        channelId,
      })
    },
    [analytics]
  )

  const trackAMMClosed = useCallback(
    (tokenId: string, tokenTicker: string, channelId: string) => {
      analytics.track('Token Market Closed', {
        tokenId,
        tokenTicker,
        channelId,
      })
    },
    [analytics]
  )

  const trackAMMTokensPurchased = useCallback(
    (tokenId: string, tokenTicker: string, channelId: string, crtAmount: number, joyPaid: number) => {
      analytics.track('Token Market Purchase', {
        tokenId,
        tokenTicker,
        channelId,
        crtAmount,
        joyPaid,
      })
    },
    [analytics]
  )

  const trackAMMTokensSold = useCallback(
    (tokenId: string, tokenTicker: string, channelId: string, crtAmount: number, joyReceived: number) => {
      analytics.track('Token Market Sell', {
        tokenId,
        tokenTicker,
        channelId,
        crtAmount,
        joyReceived,
      })
    },
    [analytics]
  )

  const trackRevenueShareStarted = useCallback(
    (channelId: string, tokenId: string, tokenTicker: string) => {
      analytics.track('Revenue Share Started', {
        channelId,
        tokenId,
        tokenTicker,
      })
    },
    [analytics]
  )

  const trackRevenueShareClosed = useCallback(
    (channelId: string, tokenId: string, tokenTicker: string) => {
      analytics.track('Revenue Share Closed', {
        channelId,
        tokenId,
        tokenTicker,
      })
    },
    [analytics]
  )

  const trackPortfolioBuyTokenClick = useCallback(
    (tokenName: string, memberId: string) => {
      analytics.track('Portfolio buy token clicked', {
        tokenName,
        memberId,
      })
    },
    [analytics]
  )

  const trackPortfolioSellTokenClick = useCallback(
    (tokenName: string, memberId: string) => {
      analytics.track('Portfolio sell token clicked', {
        tokenName,
        memberId,
      })
    },
    [analytics]
  )

  const trackPortfolioTransferTokenClick = useCallback(
    (tokenName: string, memberId: string) => {
      analytics.track('Portfolio transfer token clicked', {
        tokenName,
        memberId,
      })
    },
    [analytics]
  )

  const trackChangenowTokenBought = useCallback(
    (tokenName: string, memberId: string, amount: number) => {
      analytics.track('Changenow token bought', {
        tokenName,
        memberId,
        amount,
      })
    },
    [analytics]
  )

  const trackChangenowTokenSold = useCallback(
    (tokenName: string, memberId: string, amount: number) => {
      analytics.track('Changenow token sold', {
        tokenName,
        memberId,
        amount,
      })
    },
    [analytics]
  )

  const trackRewardsReferralLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Backlink Generated', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackRewardsOriginalCreatorsLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Original appl', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackRewardsBrandingLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Branding appl', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackJoinDiscordLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Join Discord clicked', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackTwitterPostLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Post on X clicked', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )
  const trackRoundtableEventsClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Roundtable Events Clicked', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackShareNftLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Share NFT clicked', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackShareTokenLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Share Token clicked', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const trackAmbassadorLinkClicked = useCallback(
    (channelId: string, channelTier: string) => {
      analytics.track('Rewards - Ambassador appl', {
        channelId,
        channelTier,
      })
    },
    [analytics]
  )

  const runNextQueueEvent = useCallback(async () => {
    const queueEvent = playbackEventsQueue.current.shift()
    if (!queueEvent) {
      return
    }

    const { type, params } = queueEvent

    switch (type) {
      case 'playbackStarted':
        await trackVideoPlaybackStarted(params)
        break
      case 'playbackPaused':
        await trackVideoPlaybackPaused(params)
        break
      case 'playbackResumed':
        await trackVideoPlaybackResumed(params)
        break
      case 'playbackCompleted':
        await trackVideoPlaybackCompleted(params)
        break
    }
    runNextQueueEvent()
  }, [trackVideoPlaybackCompleted, trackVideoPlaybackPaused, trackVideoPlaybackResumed, trackVideoPlaybackStarted])

  const addEventToQueue = useCallback(
    (type: playbackEventType, params: videoPlaybackParams) => {
      const queueIsEmpty = !playbackEventsQueue.current.length

      playbackEventsQueue.current.push({ type, params })
      if (queueIsEmpty) runNextQueueEvent()
    },
    [runNextQueueEvent]
  )

  return {
    addEventToQueue,
    identifyUser,
    trackAMMClosed,
    trackAMMStarted,
    trackAMMTokensPurchased,
    trackAMMTokensSold,
    trackAllNftFilterUpdated,
    trackChangenowTokenBought,
    trackChangenowTokenSold,
    trackChannelCreation,
    trackChannelFollow,
    trackClickAuthModalSignInButton,
    trackClickAuthModalSignUpButton,
    trackClickTopBarSignInButton,
    trackCommentAdded,
    trackDislikeAdded,
    trackFeaturedNFTNext,
    trackFeaturedNFTPrev,
    trackLikeAdded,
    trackLivesessionRecording,
    trackLogout,
    trackMembershipCreation,
    trackNFTCarouselNext,
    trackNFTCarouselPrev,
    trackNftMint,
    trackNftSale,
    trackPageView,
    trackPortfolioBuyTokenClick,
    trackPortfolioSellTokenClick,
    trackPortfolioTransferTokenClick,
    trackPublishAndUploadClicked,
    trackReferralLinkGenerated,
    trackRevenueShareClosed,
    trackRevenueShareStarted,
    trackTokenMintingCompleted,
    trackTokenMintingStarted,
    trackUploadVideoClicked,
    trackVideoPlaybackCompleted,
    trackVideoPlaybackPaused,
    trackVideoPlaybackResumed,
    trackVideoPlaybackStarted,
    trackVideoUpload,
    trackWithdrawnFunds,
    trackYppOptIn,
    trackYppReqsNotMet,
    trackYppSignInButtonClick,
    trackAmbassadorLinkClicked,
    trackJoinDiscordLinkClicked,
    trackRewardsOriginalCreatorsLinkClicked,
    trackShareTokenLinkClicked,
    trackShareNftLinkClicked,
    trackTwitterPostLinkClicked,
    trackRewardsBrandingLinkClicked,
    trackRewardsReferralLinkClicked,
    trackRoundtableEventsClicked,
    trackRewardsCreateChannelButtonClick,
  }
}
