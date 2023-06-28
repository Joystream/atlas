import { useCallback } from 'react'

import useSegmentAnalyticsContext from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'

export const useSegmentAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()

  const identifyUser = useCallback(
    (email: string) => {
      analytics.identify({ email })
    },
    [analytics]
  )

  const trackPageView = useCallback(
    (name: string, category = 'App', referrer = 'no data') => {
      analytics.page(category, name, {
        referrer,
      })
    },
    [analytics]
  )

  const trackYppOptIn = useCallback(
    (handle: string, email: string, category: string, subscribersCount: string) => {
      analytics.track('ypp opt-in', {
        handle,
        email,
        category,
        subscribersCount,
      })
    },
    [analytics]
  )

  const trackAccountCreation = useCallback(
    (handle: string, email: string) => {
      analytics.track('account created', {
        handle,
        email,
      })
    },
    [analytics]
  )

  const trackChannelCreation = useCallback(
    (channelId: string, channelTitle: string, language: string) => {
      analytics.track('account created', {
        channelId,
        channelTitle,
        language,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackStarted = useCallback(
    (videoId: string, channelId: string, title: string, totalLength: number, fullScreen: boolean, quality: string) => {
      analytics.track('video playback started', {
        videoId,
        channelId,
        title,
        totalLength,
        fullScreen,
        quality,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackPaused = useCallback(
    (videoId: string, channelId: string, title: string, totalLength: number, fullScreen: boolean, quality: string) => {
      analytics.track('video playback paused', {
        videoId,
        channelId,
        title,
        totalLength,
        fullScreen,
        quality,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackResumed = useCallback(
    (videoId: string, channelId: string, title: string, totalLength: number, fullScreen: boolean, quality: string) => {
      analytics.track('video playback resumed', {
        videoId,
        channelId,
        title,
        totalLength,
        fullScreen,
        quality,
      })
    },
    [analytics]
  )

  const trackVideoPlaybackCompleted = useCallback(
    (videoId: string, channelId: string, title: string, totalLength: number, fullScreen: boolean, quality: string) => {
      analytics.track('video playback completed', {
        videoId,
        channelId,
        title,
        totalLength,
        fullScreen,
        quality,
      })
    },
    [analytics]
  )

  const trackVideoUpload = useCallback(
    (title: string, channelId: string) => {
      analytics.track('video uploaded', {
        channelId,
        title,
      })
    },
    [analytics]
  )

  const trackNftMint = useCallback(
    (title: string, channelId: string) => {
      analytics.track('nft minted', {
        title,
        channelId,
      })
    },
    [analytics]
  )

  const trackNftSale = useCallback(
    (saleType: string, price: string) => {
      analytics.track('nft put on sale', {
        saleType,
        price,
      })
    },
    [analytics]
  )

  const trackCommentAdded = useCallback(
    (commentBody: string, videoId: string) => {
      analytics.track('comment added', {
        commentBody,
        videoId,
      })
    },
    [analytics]
  )

  const trackLikeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('like added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const trackDislikeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('dislike added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const trackChannelFollow = useCallback(
    (channelId: string) => {
      analytics.track('channel followed', {
        channelId,
      })
    },
    [analytics]
  )

  const trackYppSignInButtonClick = useCallback(() => {
    analytics.track('YPP Landing Sign In w Google Clicked')
  }, [analytics])

  return {
    identifyUser,
    trackPageView,
    trackYppOptIn,
    trackAccountCreation,
    trackChannelCreation,
    trackVideoPlaybackStarted,
    trackVideoPlaybackPaused,
    trackVideoPlaybackResumed,
    trackVideoPlaybackCompleted,
    trackVideoUpload,
    trackNftMint,
    trackNftSale,
    trackCommentAdded,
    trackLikeAdded,
    trackDislikeAdded,
    trackChannelFollow,
    trackYppSignInButtonClick,
  }
}
