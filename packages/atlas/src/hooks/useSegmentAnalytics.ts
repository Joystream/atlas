import { useCallback, useRef } from 'react'

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

  const playbackEventsQueue = useRef<{ type: playbackEventType; params: videoPlaybackParams }[]>([])

  const identifyUser = useCallback(
    (params: IdentifyUserParams) => {
      analytics.identify(params.email, params)
    },
    [analytics]
  )

  const trackPageView = useCallback(
    (name: string, params?: PageViewParams) => {
      analytics.page(undefined, name, params)
    },
    [analytics]
  )

  const trackYppOptIn = useCallback(
    ({ handle, email, category, subscribersCount, referrerId, utmSource, utmCampaign }: YppOptInParams) => {
      analytics.track('YPP Sign Up Completed', {
        handle,
        email,
        category,
        subscribersCount,
        referrerId,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
      })
    },
    [analytics]
  )

  const trackMembershipCreation = useCallback(
    (handle: string, email: string) => {
      analytics.track('Membership created', {
        handle,
        email,
      })
    },
    [analytics]
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

  const trackClickTopBarSignInButton = useCallback(
    (utmSource?: string | null, utmCampaign?: string | null) => {
      analytics.track('Top Nav Sign In Clicked', { utm_source: utmSource, utm_campaign: utmCampaign })
    },
    [analytics]
  )

  const trackClickAuthModalSignInButton = useCallback(
    (utmSource?: string | null, utmCampaign?: string | null) => {
      analytics.track('YPP Reqs Modal - Sign In Clicked', { utm_source: utmSource, utm_campaign: utmCampaign })
    },
    [analytics]
  )

  const trackClickAuthModalSignUpButton = useCallback(
    (utmSource?: string | null, utmCampaign?: string | null) => {
      analytics.track('YPP Reqs Modal - Create Account Clicked', { utm_source: utmSource, utm_campaign: utmCampaign })
    },
    [analytics]
  )

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

  const trackYppSignInButtonClick = useCallback(
    (
      referrer: string | null | undefined,
      utmSource: string | null | undefined,
      utmCampaign: string | null | undefined
    ) => {
      analytics.track('YPP Landing Sign In w Google Clicked', {
        referrer,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
      })
    },
    [analytics]
  )

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
      utmCampaign: string | null | undefined
    ) => {
      analytics.track('YPP Sign Up Failed - Reqs Not Met', { errors, utmSource, utmCampaign })
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
    (channelId: string, tokenTicker: string, initSupply: string, safetyOption: string) => {
      analytics.track('Token minting completed', {
        channelId,
        tokenTicker,
        initSupply,
        safetyOption,
      })
    },
    [analytics]
  )

  const trackAMMStarted = useCallback(
    (tokenTicker: string, channelId: string) => {
      analytics.track('Token Market Opened', {
        tokenTicker,
        channelId,
      })
    },
    [analytics]
  )

  const trackAMMClosed = useCallback(
    (tokenTicker: string, channelId: string) => {
      analytics.track('Token Market Closed', {
        tokenTicker,
        channelId,
      })
    },
    [analytics]
  )

  const trackAMMTokensPurchased = useCallback(
    (tokenTicker: string, channelId: string, crtAmount: string, joyPaid: string) => {
      analytics.track('Token Market Purchase', {
        tokenTicker,
        channelId,
        crtAmount,
        joyPaid,
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
    trackAllNftFilterUpdated,
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
    trackPublishAndUploadClicked,
    trackReferralLinkGenerated,
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
  }
}
