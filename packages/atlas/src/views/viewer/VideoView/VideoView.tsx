import { generateVideoMetaTags } from '@joystream/atlas-meta-server/src/tags'
import BN from 'bn.js'
import { format } from 'date-fns'
import { throttle } from 'lodash-es'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useParams } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer/polyfilled'

import { useAddVideoView, useBasicVideos, useFullVideo } from '@/api/hooks/video'
import { SvgActionFlag, SvgActionMore, SvgActionShare } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { NumberFormat } from '@/components/NumberFormat'
import { Tooltip } from '@/components/Tooltip'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { CTA_MAP, CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { NftWidget, useNftWidget } from '@/components/_nft/NftWidget'
import { ContextMenu } from '@/components/_overlays/ContextMenu'
import { ReportModal } from '@/components/_overlays/ReportModal'
import { PlaylistWidget } from '@/components/_video/PlaylistWidget/PlaylistWidget'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { AvailableTrack } from '@/components/_video/VideoPlayer/SettingsButtonWithPopover'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useReactionTransactions } from '@/hooks/useReactionTransactions'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { VideoReaction } from '@/joystream-lib/types'
import { useAsset, useSubtitlesAssets } from '@/providers/assets/assets.hooks'
import { useFee } from '@/providers/joystream/joystream.hooks'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { useOverlayManager } from '@/providers/overlayManager'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatDate } from '@/utils/time'

import { CommentsSection } from './CommentsSection'
import { MoreVideos } from './MoreVideos'
import { VideoDetails } from './VideoDetails'
import { VideoUnavailableError } from './VideoUnavailableError'
import {
  BlockedVideoGradientPlaceholder,
  BlockedVideoPlaceholder,
  ButtonsContainer,
  ChannelContainer,
  Meta,
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

export const VideoView: FC = () => {
  const { id } = useParams()
  const { memberId, signIn, isLoggedIn } = useUser()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reactionFee, setReactionFee] = useState<BN | undefined>()
  const { openSignInDialog } = useDisplaySignInDialog({ interaction: true })
  const { height: playerContainerHeight = 0, ref: playerContainerRef } = useResizeObserver({
    box: 'border-box',
  })

  const { openNftPutOnSale, openNftAcceptBid, openNftChangePrice, openNftPurchase, openNftSettlement, cancelNftSale } =
    useNftActions()
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const { loading, video, error } = useFullVideo(
    id ?? '',
    {
      onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
    },
    // cancel video filters - if video is accessed directly with a link allowed it to be unlisted, censored and have un-uploaded assets
    { where: { isPublic_eq: undefined, isCensored_eq: undefined, thumbnailPhoto: undefined, media: undefined } }
  )
  const [videoReactionProcessing, setVideoReactionProcessing] = useState(false)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)
  const nftWidgetProps = useNftWidget(video)
  const { likeOrDislikeVideo } = useReactionTransactions()
  const { withdrawBid } = useNftTransactions()

  const mdMatch = useMediaMatch('md')
  const { addVideoView } = useAddVideoView()
  const {
    watchedVideos,
    cinematicView,
    actions: { updateWatchedVideos },
  } = usePersonalDataStore((state) => state)
  const videoCategory = video?.category ? video.category.id : null
  const belongsToCategories = videoCategory
    ? displayCategories.filter((category) => category.videoCategories.includes(videoCategory))
    : null

  const { anyOverlaysOpen } = useOverlayManager()
  const { ref: playerRef, inView: isPlayerInView } = useInView()
  const pausePlayNext = anyOverlaysOpen || !isPlayerInView || isCommenting

  const { url: mediaUrl, isLoadingAsset: isMediaLoading } = useAsset(video?.media)
  const { url: thumbnailUrl } = useAsset(video?.thumbnailPhoto)
  const subtitlesAssets = useSubtitlesAssets(video?.subtitles)
  const availableTracks = useMemo(() => {
    if (!video?.subtitles) return []

    return video.subtitles
      .filter((subtitle) => !!subtitle.asset && subtitlesAssets[subtitle.id]?.url)
      .map((subtitle) => {
        const resolvedLanguageName = atlasConfig.derived.languagesLookup[subtitle.language?.iso || '']
        const url = subtitlesAssets[subtitle.id]?.url
        return {
          label: subtitle.type === 'subtitles' ? resolvedLanguageName : `${resolvedLanguageName} (CC)`,
          language: subtitle.type === 'subtitles' ? subtitle.language?.iso : `${subtitle.language?.iso}-cc`,
          src: url,
        }
      })
      .filter((subtitles): subtitles is AvailableTrack => !!subtitles.language && !!subtitles.label && !!subtitles.src)
  }, [subtitlesAssets, video?.subtitles])

  const videoMetaTags = useMemo(() => {
    if (!video || !thumbnailUrl) return {}
    return generateVideoMetaTags(
      video,
      thumbnailUrl,
      atlasConfig.general.appName,
      window.location.origin,
      atlasConfig.general.appTwitterId
    )
  }, [video, thumbnailUrl])
  const headTags = useHeadTags(video?.title, videoMetaTags)

  const [isShareDialogOpen, setShareDialogOpen] = useState(false)

  const savedVideoTimestamp = watchedVideos?.find((v) => v.id === video?.id)?.timestamp
  const startTimestamp = useVideoStartTimestamp(video?.duration, savedVideoTimestamp)

  const channelId = video?.channel?.id
  const channelName = video?.channel?.title
  const videoId = video?.id
  const categoryId = video?.category?.id
  const numberOfLikes = video?.reactions.filter(({ reaction }) => reaction === 'LIKE').length
  const numberOfDislikes = video?.reactions.filter(({ reaction }) => reaction === 'UNLIKE').length
  const videoNotAvailable = !loading && !video

  const reactionStepperState = useMemo(() => {
    if (!video) {
      return 'loading'
    }
    if (videoReactionProcessing) {
      return 'processing'
    }
    const myReaction = video?.reactions.find(({ memberId: reactionMemberId }) => reactionMemberId === memberId)
    if (myReaction) {
      if (myReaction.reaction === 'LIKE') {
        return 'liked'
      }
      if (myReaction.reaction === 'UNLIKE') {
        return 'disliked'
      }
    }
    return 'default'
  }, [memberId, videoReactionProcessing, video])

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

  const { getTxFee: getReactionFee } = useFee('reactToVideoTx')

  const handleCalculateFeeForPopover = async (reaction: VideoReaction) => {
    if (!memberId || !video?.id) return
    const fee = await getReactionFee([memberId, video?.id, reaction])
    setReactionFee(fee)
  }

  const handleReact = useCallback(
    async (reaction: VideoReaction) => {
      if (!isLoggedIn) {
        openSignInDialog({ onConfirm: signIn })
        return false
      } else if (video?.id) {
        setVideoReactionProcessing(true)
        const fee = reactionFee || (await getReactionFee([memberId || '', video?.id, reaction]))
        const reacted = await likeOrDislikeVideo(video.id, reaction, video.title, fee)
        setVideoReactionProcessing(false)
        return reacted
      }
      return false
    },
    [getReactionFee, isLoggedIn, likeOrDislikeVideo, memberId, openSignInDialog, reactionFee, signIn, video]
  )

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

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  const handleAddVideoView = useCallback(() => {
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
  }, [addVideoView, categoryId, channelId, videoId])

  // todo replace once we will able to use actual playlist
  const playlistQueryParam = useRouterQuery('playlist')
  const isPlaylist = playlistQueryParam === 'true'
  const { videos: playlistVideos = [] } = useBasicVideos(
    {
      where: { channel: { id_eq: channelId } },
      limit: 30,
    },
    { skip: !isPlaylist }
  )

  if (error) {
    return <ViewErrorFallback />
  }

  const isCinematic = cinematicView || !mdMatch
  const sideItems = (
    <GridItem colSpan={{ xxs: 12, md: 4 }}>
      {playlistVideos.length > 0 && (
        <PlaylistWidget
          maxHeight={playerContainerHeight}
          channelId={channelId || ''}
          channelTitle={channelName || ''}
          playlistLength={playlistVideos.length}
          currentVideoNumber={1}
          playlistTitle="Playlist title"
          playlistVideos={playlistVideos}
        />
      )}
      {videoNotAvailable
        ? mdMatch && (
            <>
              {!cinematicView && <BlockedVideoPlaceholder />}
              <BlockedVideoGradientPlaceholder />
            </>
          )
        : !!nftWidgetProps && (
            <NftWidget
              {...nftWidgetProps}
              onNftPutOnSale={() => id && openNftPutOnSale(id)}
              onNftCancelSale={() => id && nftWidgetProps.saleType && cancelNftSale(id, nftWidgetProps.saleType)}
              onNftAcceptBid={() => id && openNftAcceptBid(id)}
              onNftChangePrice={() => id && openNftChangePrice(id)}
              onNftPurchase={() => id && openNftPurchase(id)}
              onNftSettlement={() => id && openNftSettlement(id)}
              onNftBuyNow={() => id && openNftPurchase(id, { fixedPrice: true })}
              onWithdrawBid={(bid, createdAt) => id && createdAt && bid && withdrawBid(id, bid, createdAt)}
            />
          )}
      <MoreVideos channelId={channelId} channelName={channelName} videoId={id} type="channel" />
      {belongsToCategories?.map((category) => (
        <MoreVideos
          key={category.id}
          categoryId={category?.id}
          categoryName={category.name}
          videoId={id}
          type="category"
        />
      ))}
    </GridItem>
  )

  const detailsItems = videoNotAvailable ? (
    mdMatch && <BlockedVideoGradientPlaceholder />
  ) : (
    <>
      <TitleContainer>
        {video ? (
          <TitleText as="h1" variant={mdMatch ? 'h500' : 'h400'}>
            {video.title}
          </TitleText>
        ) : (
          <SkeletonLoader height={mdMatch ? 56 : 32} width={400} />
        )}
        <VideoUtils>
          <Meta as="span" variant={mdMatch ? 't300' : 't100'} color="colorText">
            {video ? (
              <>
                <Tooltip
                  placement="top-start"
                  offsetY={8}
                  delay={[1000, null]}
                  text={`${formatDate(video.createdAt)} at ${format(video.createdAt, 'HH:mm')}`}
                >
                  {formatDate(video.createdAt)}
                </Tooltip>{' '}
                • <NumberFormat as="span" format="full" value={video.views} color="colorText" /> views
              </>
            ) : (
              <SkeletonLoader height={24} width={200} />
            )}
          </Meta>
          <StyledReactionStepper
            reactionPopoverDismissed={reactionPopoverDismissed || !isLoggedIn}
            onReact={handleReact}
            fee={reactionFee}
            onCalculateFee={handleCalculateFeeForPopover}
            state={reactionStepperState}
            likes={numberOfLikes}
            dislikes={numberOfDislikes}
          />
          <ButtonsContainer>
            <Button variant="tertiary" icon={<SvgActionShare />} onClick={handleShare}>
              Share
            </Button>
            <ContextMenu
              placement="bottom-end"
              items={[
                {
                  onClick: () => setShowReportDialog(true),
                  label: 'Report video',
                  nodeStart: <SvgActionFlag />,
                },
              ]}
              trigger={<Button icon={<SvgActionMore />} variant="tertiary" size="medium" />}
            />
            {video?.id && (
              <ReportModal
                show={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                entityId={video?.id}
                type="video"
              />
            )}
          </ButtonsContainer>
        </VideoUtils>
      </TitleContainer>
      <ChannelContainer>
        <ChannelLink followButton id={channelId} textVariant="h300" avatarSize="small" />
      </ChannelContainer>
      <VideoDetails video={video} categoryData={belongsToCategories} />
    </>
  )

  return (
    <>
      {headTags}
      <PlayerGridWrapper cinematicView={isCinematic}>
        <PlayerWrapper cinematicView={isCinematic}>
          <PlayerGridItem colSpan={{ xxs: 12, md: cinematicView ? 12 : 8 }}>
            <div ref={playerContainerRef}>
              <PlayerContainer
                className={transitions.names.slide}
                cinematicView={cinematicView}
                noVideo={videoNotAvailable}
              >
                {videoNotAvailable ? (
                  <VideoUnavailableError isCinematic={isCinematic} />
                ) : !isMediaLoading && video ? (
                  <VideoPlayer
                    onCloseShareDialog={() => setShareDialogOpen(false)}
                    onAddVideoView={handleAddVideoView}
                    isShareDialogOpen={isShareDialogOpen}
                    isVideoPending={!video?.media?.isAccepted}
                    videoId={video?.id}
                    autoplay
                    src={mediaUrl}
                    onEnd={handleVideoEnd}
                    onTimeUpdated={handleTimeUpdate}
                    startTime={startTimestamp}
                    isPlayNextDisabled={pausePlayNext}
                    ref={playerRef}
                    availableTextTracks={availableTracks}
                  />
                ) : (
                  <PlayerSkeletonLoader />
                )}
              </PlayerContainer>
            </div>
            {!isCinematic && (
              <>
                {detailsItems}
                {!videoNotAvailable && (
                  <CommentsSection
                    video={video}
                    videoLoading={loading}
                    disabled={video ? !video?.isCommentSectionEnabled : undefined}
                    onCommentInputFocus={setIsCommenting}
                  />
                )}
              </>
            )}
          </PlayerGridItem>
          {!isCinematic && sideItems}
        </PlayerWrapper>
      </PlayerGridWrapper>
      <LimitedWidthContainer>
        {isCinematic && !(!mdMatch && videoNotAvailable) && (
          <LayoutGrid>
            <GridItem className={transitions.names.slide} colSpan={{ xxs: 12, md: cinematicView ? 8 : 12 }}>
              {detailsItems}
              {!videoNotAvailable && (
                <CommentsSection
                  video={video}
                  videoLoading={loading}
                  disabled={video ? !video?.isCommentSectionEnabled : undefined}
                  onCommentInputFocus={setIsCommenting}
                />
              )}
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
