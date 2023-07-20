import { useCallback, useRef } from 'react'

import { useSegmentAnalyticsContext } from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'

export type videoPlaybackParams = {
  videoId: string
  channelId: string
  title: string
  category: string
  totalLength: number
  fullScreen: boolean
  quality: string
}

type PageViewParams = {
  referrer?: string
  tab?: string
  utm_source?: string
  isYppFlow?: boolean
}

type AllNftFilters = {
  priceFrom?: number
  priceTo?: number
  status?: string
  sortBy?: string
}

type playbackEventType = 'playbackStarted' | 'playbackPaused' | 'playbackResumed' | 'playbackCompleted'

export const useSegmentAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()

  const playbackEventsQueue = useRef<{ type: playbackEventType; params: videoPlaybackParams }[]>([])

  const identifyUser = useCallback(
    (email = 'no data') => {
      analytics.identify(email, { email })
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
    (
      handle = 'no data',
      email = 'no data',
      category = 'no data',
      subscribersCount: string,
      referrerId = 'no data',
      utmSource = 'no data'
    ) => {
      analytics.track('YPP Sign Up Completed', {
        handle,
        email,
        category,
        subscribersCount,
        referrerId,
        utmSource,
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
    (referrer: string | null | undefined, utmSource: string | null | undefined) => {
      analytics.track('YPP Landing Sign In w Google Clicked', { referrer, utmSource })
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

  const trackReferralLinkGenerated = useCallback(
    (channelId: string | null | undefined) => {
      analytics.track('Referral link generated', {
        channelId,
      })
    },
    [analytics]
  )

  const trackLogout = useCallback(() => {
    analytics.reset()
  }, [analytics])

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
    trackAllNftFilterUpdated,
    trackChannelCreation,
    trackChannelFollow,
    trackCommentAdded,
    trackDislikeAdded,
    trackFeaturedNFTNext,
    trackFeaturedNFTPrev,
    trackLikeAdded,
    trackLogout,
    trackMembershipCreation,
    trackNFTCarouselNext,
    trackNFTCarouselPrev,
    trackNftMint,
    trackNftSale,
    trackPageView,
    trackReferralLinkGenerated,
    trackVideoPlaybackCompleted,
    trackVideoPlaybackPaused,
    trackVideoPlaybackResumed,
    trackVideoPlaybackStarted,
    trackVideoUpload,
    trackYppOptIn,
    trackYppSignInButtonClick,
  }
}
