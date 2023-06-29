import { useCallback } from 'react'

import useSegmentAnalyticsContext from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'

export const useSegmentAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()

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

  const trackVideoView = useCallback(
    (videoId: string, channelId: string, channelTitle: string, description: string, isNft: boolean) => {
      analytics.track('video viewed', {
        videoId,
        channelId,
        channelTitle,
        description,
        isNft,
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

  return {
    trackPageView,
    trackYppOptIn,
    trackAccountCreation,
    trackChannelCreation,
    trackVideoView,
    trackVideoUpload,
    trackNftMint,
    trackNftSale,
    trackCommentAdded,
    trackLikeAdded,
    trackDislikeAdded,
    trackChannelFollow,
  }
}
