import { generateVideoMetaTags } from '@joystream/atlas-meta-server/src/tags'
import { throttle } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'

import { useAddVideoView, useVideo } from '@/api/hooks'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SvgActionLinkUrl } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NftWidget, useNftWidget } from '@/components/_nft/NftWidget'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { CTA_MAP } from '@/config/cta'
import { absoluteRoutes } from '@/config/routes'
import { useCategoryMatch } from '@/hooks/useCategoriesMatch'
import { useClipboard } from '@/hooks/useClipboard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useRedirectMigratedContent } from '@/hooks/useRedirectMigratedContent'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { VideoReaction } from '@/joystream-lib'
import { useAsset } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { useOverlayManager } from '@/providers/overlayManager'
import { usePersonalDataStore } from '@/providers/personalData'
import { useTransaction } from '@/providers/transactionManager'
import { useUser } from '@/providers/user'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatVideoViewsAndDate } from '@/utils/video'

import { CommentsSection } from './CommentsSection'
import { MoreVideos } from './MoreVideos'
import { VideoDetails } from './VideoDetails'
import {
  ChannelContainer,
  CopyLink,
  Meta,
  NotFoundVideoContainer,
  PlayerContainer,
  PlayerGridItem,
  PlayerGridWrapper,
  PlayerSkeletonLoader,
  PlayerWrapper,
  StyledCallToActionWrapper,
  StyledReactionStepper,
  TitleContainer,
  TitleText,
  VideoUtils,
} from './VideoView.styles'

export const VideoView: React.FC = () => {
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)
  useRedirectMigratedContent({ type: 'video' })
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { id } = useParams()
  const { activeMemberId } = useUser()
  const { openNftPutOnSale, cancelNftSale, openNftAcceptBid, openNftChangePrice, openNftPurchase, openNftSettlement } =
    useNftActions()
  const { withdrawBid } = useNftTransactions()
  const { copyToClipboard } = useClipboard()
  const { loading, video, error, refetch } = useVideo(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
  })
  const nftWidgetProps = useNftWidget(id)

  const mdMatch = useMediaMatch('md')
  const { addVideoView } = useAddVideoView()
  const {
    watchedVideos,
    cinematicView,
    actions: { updateWatchedVideos },
  } = usePersonalDataStore((state) => state)
  const category = useCategoryMatch(video?.category?.id)

  const { anyOverlaysOpen } = useOverlayManager()
  const { ref: playerRef, inView: isPlayerInView } = useInView()
  const pausePlayNext = anyOverlaysOpen || !isPlayerInView

  const { url: mediaUrl, isLoadingAsset: isMediaLoading } = useAsset(video?.media)
  const { url: thumbnailUrl } = useAsset(video?.thumbnailPhoto)

  const videoMetaTags = useMemo(() => {
    if (!video || !thumbnailUrl) return {}
    return generateVideoMetaTags(video, thumbnailUrl)
  }, [video, thumbnailUrl])
  const headTags = useHeadTags(video?.title, videoMetaTags)

  const { startTimestamp, setStartTimestamp } = useVideoStartTimestamp(video?.duration)

  // Restore an interrupted video state
  useEffect(() => {
    if (startTimestamp != null || !video) {
      return
    }
    const currentVideo = watchedVideos.find((v) => v.id === video?.id)
    setStartTimestamp(currentVideo?.__typename === 'INTERRUPTED' ? currentVideo.timestamp : 0)
  }, [watchedVideos, startTimestamp, video, setStartTimestamp])

  const channelId = video?.channel?.id
  const channelName = video?.channel?.title
  const videoId = video?.id
  const categoryId = video?.category?.id
  const numberOfLikes = video?.reactions.filter(({ reaction }) => reaction === 'LIKE').length
  const numberOfDislikes = video?.reactions.filter(({ reaction }) => reaction === 'UNLIKE').length

  const reactionStepperState = useMemo(() => {
    if (!video) {
      return 'loading'
    }
    if (videoReactionProcessing) {
      return 'processing'
    }
    const myReaction = video?.reactions.find(({ memberId }) => memberId === activeMemberId)
    if (myReaction) {
      if (myReaction.reaction === 'LIKE') {
        return 'liked'
      }
      if (myReaction.reaction === 'UNLIKE') {
        return 'disliked'
      }
    }
    return 'default'
  }, [activeMemberId, videoReactionProcessing, video])

  const handleLike = (reaction: VideoReaction) => {
    if (!joystream || !activeMemberId || !video) {
      return
    }

    handleTransaction({
      preProcess: () => setVideoReactionProcessing(true),
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).reactToVideo(activeMemberId, video.id, reaction, proxyCallback(updateStatus)),
      minimized: {
        signErrorMessage: 'Failed to react to video',
      },
      onTxFinalize: async () => {
        await refetch()
        setVideoReactionProcessing(false)
      },
    })
  }

  useEffect(() => {
    if (!videoId || !channelId) {
      return
    }
    addVideoView({
      variables: {
        videoId,
        channelId,
        categoryId,
      },
    }).catch((error) => {
      SentryLogger.error('Failed to increase video views', 'VideoView', error)
    })
  }, [addVideoView, videoId, channelId, categoryId])

  // Save the video timestamp
  // disabling eslint for this line since debounce is an external fn and eslint can't figure out its args, so it will complain.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTimeUpdate = useCallback(
    throttle((time) => {
      if (video?.id) {
        updateWatchedVideos('INTERRUPTED', video.id, time)
      }
    }, 5000),
    [video?.id]
  )

  const handleVideoEnd = useCallback(() => {
    if (video?.id) {
      handleTimeUpdate.cancel()
      updateWatchedVideos('COMPLETED', video?.id)
    }
  }, [video?.id, handleTimeUpdate, updateWatchedVideos])

  // use Media Session API to provide rich metadata to the browser
  useEffect(() => {
    const supported = 'mediaSession' in navigator
    if (!supported || !video) {
      return
    }

    const artwork: MediaImage[] = thumbnailUrl ? [{ src: thumbnailUrl, type: 'image/webp', sizes: '640x360' }] : []

    navigator.mediaSession.metadata = new MediaMetadata({
      title: video.title || '',
      artist: video.channel.title || '',
      album: '',
      artwork: artwork,
    })

    return () => {
      navigator.mediaSession.metadata = null
    }
  }, [thumbnailUrl, video])

  const handleCopyLink = () => {
    copyToClipboard(window.location.href, 'Video URL copied to clipboard')
  }

  if (error) {
    return <ViewErrorFallback />
  }

  if (!loading && !video) {
    return (
      <NotFoundVideoContainer>
        <EmptyFallback
          title="Video not found"
          button={
            <Button variant="secondary" size="large" to={absoluteRoutes.viewer.index()}>
              Go back to home page
            </Button>
          }
        />
      </NotFoundVideoContainer>
    )
  }

  const isCinematic = cinematicView || !mdMatch
  const sideItems = (
    <GridItem colSpan={{ xxs: 12, md: 4 }}>
      {!!nftWidgetProps && (
        <NftWidget
          {...nftWidgetProps}
          onNftPutOnSale={() => id && openNftPutOnSale(id)}
          onNftCancelSale={() => id && nftWidgetProps.saleType && cancelNftSale(id, nftWidgetProps.saleType)}
          onNftAcceptBid={() => id && openNftAcceptBid(id)}
          onNftChangePrice={() => id && openNftChangePrice(id)}
          onNftPurchase={() => id && openNftPurchase(id)}
          onNftSettlement={() => id && openNftSettlement(id)}
          onNftBuyNow={() => id && openNftPurchase(id, { fixedPrice: true })}
          onWithdrawBid={() => id && withdrawBid(id)}
        />
      )}
      <MoreVideos channelId={channelId} channelName={channelName} videoId={id} type="channel" />
      <MoreVideos categoryId={category?.id} categoryName={category?.name} videoId={id} type="category" />
    </GridItem>
  )

  const detailsItems = (
    <>
      {headTags}
      <TitleContainer>
        {video ? (
          <TitleText variant={mdMatch ? 'h600' : 'h400'}>{video.title}</TitleText>
        ) : (
          <SkeletonLoader height={mdMatch ? 56 : 32} width={400} />
        )}
        <VideoUtils>
          <Meta variant={mdMatch ? 't300' : 't100'} secondary>
            {video ? (
              formatVideoViewsAndDate(video.views || null, video.createdAt, { fullViews: true })
            ) : (
              <SkeletonLoader height={24} width={200} />
            )}
          </Meta>
          <StyledReactionStepper
            onLike={() => handleLike('like')}
            onDislike={() => handleLike('dislike')}
            state={reactionStepperState}
            likes={numberOfLikes}
            dislikes={numberOfDislikes}
          />
          <CopyLink variant="tertiary" icon={<SvgActionLinkUrl />} onClick={handleCopyLink}>
            Copy link
          </CopyLink>
        </VideoUtils>
      </TitleContainer>
      <ChannelContainer>
        <ChannelLink followButton id={channelId} textVariant="h300" avatarSize="small" />
      </ChannelContainer>
      <VideoDetails video={video} category={category} />
    </>
  )

  return (
    <>
      <PlayerGridWrapper cinematicView={isCinematic}>
        <PlayerWrapper cinematicView={isCinematic}>
          <PlayerGridItem colSpan={{ xxs: 12, md: cinematicView ? 12 : 8 }}>
            <PlayerContainer className={transitions.names.slide} cinematicView={cinematicView}>
              {!isMediaLoading && video ? (
                <VideoPlayer
                  isVideoPending={!video?.media?.isAccepted}
                  channelId={video?.channel?.id}
                  videoId={video?.id}
                  autoplay
                  src={mediaUrl}
                  onEnd={handleVideoEnd}
                  onTimeUpdated={handleTimeUpdate}
                  startTime={startTimestamp}
                  isPlayNextDisabled={pausePlayNext}
                  ref={playerRef}
                />
              ) : (
                <PlayerSkeletonLoader />
              )}
            </PlayerContainer>
            {!isCinematic && (
              <>
                {detailsItems}
                <CommentsSection videoAuthorId={video?.channel.ownerMember?.id || ''} />
              </>
            )}
          </PlayerGridItem>
          {!isCinematic && sideItems}
        </PlayerWrapper>
      </PlayerGridWrapper>
      <LimitedWidthContainer>
        {isCinematic && (
          <LayoutGrid>
            <GridItem className={transitions.names.slide} colSpan={{ xxs: 12, md: cinematicView ? 8 : 12 }}>
              {detailsItems}
              <CommentsSection videoAuthorId={video?.channel.ownerMember?.id || ''} />
            </GridItem>
            {sideItems}
          </LayoutGrid>
        )}
        <StyledCallToActionWrapper>
          {['popular', 'new', 'discover'].map((item, idx) => (
            <CallToActionButton key={`cta-${idx}`} {...CTA_MAP[item]} />
          ))}
        </StyledCallToActionWrapper>
      </LimitedWidthContainer>
    </>
  )
}
