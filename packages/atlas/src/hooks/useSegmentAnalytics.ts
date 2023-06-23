import { useCallback } from 'react'

import useSegmentAnalyticsContext from '@/providers/segmentAnalytics/useSegmentAnalyticsContext'

const useAnalytics = () => {
  const { analytics } = useSegmentAnalyticsContext()

  const pageViewed = useCallback(
    (name: string, category = 'App') => {
      analytics.page(category, name)
    },
    [analytics]
  )

  const yppOptIn = useCallback(
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

  const accountCreated = useCallback(
    (handle: string, email: string) => {
      analytics.track('account created', {
        handle,
        email,
      })
    },
    [analytics]
  )

  const channelCreated = useCallback(
    (channelId: string, channelTitle: string, language: string) => {
      analytics.track('account created', {
        channelId,
        channelTitle,
        language,
      })
    },
    [analytics]
  )

  const videoViewed = useCallback(
    (videoId: string, channelId: string, channelTitle: string, description: string, isNft: boolean) => {
      analytics.track('video viewed', {
        channelId,
        channelTitle,
        description,
        isNft,
      })
    },
    [analytics]
  )

  const videoUploaded = useCallback(
    (title: string, channelId: string) => {
      analytics.track('video uploaded', {
        channelId,
        title,
      })
    },
    [analytics]
  )

  const nftMinted = useCallback(
    (title: string, channelId: string) => {
      analytics.track('nft minted', {
        title,
        channelId,
      })
    },
    [analytics]
  )

  const nftSale = useCallback(
    (saleType: string, price: string) => {
      analytics.track('nft put on sale', {
        saleType,
        price,
      })
    },
    [analytics]
  )

  const commentAdded = useCallback(
    (commentBody: string, videoId: string) => {
      analytics.track('comment added', {
        commentBody,
        videoId,
      })
    },
    [analytics]
  )

  const likeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('like added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const dislikeAdded = useCallback(
    (videoId: string, memberId: string) => {
      analytics.track('dislike added', {
        memberId,
        videoId,
      })
    },
    [analytics]
  )

  const followChannel = useCallback(
    (channelId: string) => {
      analytics.track('channel followed', {
        channelId,
      })
    },
    [analytics]
  )

  return {
    pageViewed,
    yppOptIn,
    accountCreated,
    channelCreated,
    videoViewed,
    videoUploaded,
    nftMinted,
    nftSale,
    commentAdded,
    likeAdded,
    dislikeAdded,
    followChannel,
  }
}

export default useAnalytics
