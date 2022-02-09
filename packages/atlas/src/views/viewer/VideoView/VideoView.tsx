import { generateVideoMetaTags } from '@joystream/atlas-meta-server/src/tags'
import { throttle } from 'lodash-es'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAddVideoView, useVideo } from '@/api/hooks'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoPlayer } from '@/components/_video/VideoPlayer'
import { CTA_MAP } from '@/config/cta'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { useCategoryMatch } from '@/hooks/useCategoriesMatch'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useRedirectMigratedGizaContent } from '@/hooks/useRedirectMigratedGizaContent'
import { useVideoStartTimestamp } from '@/hooks/useVideoStartTimestamp'
import { useAsset } from '@/providers/assets'
import { usePersonalDataStore } from '@/providers/personalData'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatVideoViewsAndDate } from '@/utils/video'

import { MoreVideos } from './MoreVideos'
import {
  Category,
  CategoryWrapper,
  ChannelContainer,
  DescriptionContainer,
  DescriptionSkeletonLoader,
  DescriptionTitle,
  DetailsWrapper,
  ExpandButton,
  LicenceCategoryWrapper,
  Meta,
  NotFoundVideoContainer,
  PlayerContainer,
  PlayerSkeletonLoader,
  PlayerWrapper,
  StyledCallToActionWrapper,
  StyledLimitedWidthContainer,
  TitleContainer,
  TitleText,
} from './VideoView.styles'

export const VideoView: React.FC = () => {
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  useRedirectMigratedGizaContent({ type: 'video' })
  const { id } = useParams()
  const { loading, video, error } = useVideo(id ?? '', {
    onError: (error) => SentryLogger.error('Failed to load video data', 'VideoView', error),
  })
  const mdMatch = useMediaMatch('md')
  const { addVideoView } = useAddVideoView()
  const watchedVideos = usePersonalDataStore((state) => state.watchedVideos)
  const updateWatchedVideos = usePersonalDataStore((state) => state.actions.updateWatchedVideos)
  const category = useCategoryMatch(video?.category?.id)

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

  const replaceUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    return parts.reduce((acc, part, idx) => {
      const node = urlRegex.test(part) ? (
        <Button size="large" textOnly key={`description-link-${idx}`} to={part}>
          {part}
        </Button>
      ) : (
        part
      )

      return [...acc, node]
    }, [] as React.ReactNode[])
  }

  const toggleDetailsExpand = () => {
    setDetailsExpanded((prevState) => !prevState)
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

  const foundLicense = knownLicenses.find((license) => license.code === video?.license?.code)

  return (
    <>
      {headTags}
      <PlayerWrapper>
        <PlayerContainer>
          {!isMediaLoading && video ? (
            <VideoPlayer
              isVideoPending={!video.media?.isAccepted}
              channelId={video.channel?.id}
              videoId={video.id}
              autoplay
              src={mediaUrl}
              fill
              onEnd={handleVideoEnd}
              onTimeUpdated={handleTimeUpdate}
              startTime={startTimestamp}
            />
          ) : (
            <PlayerSkeletonLoader />
          )}
        </PlayerContainer>
      </PlayerWrapper>
      <StyledLimitedWidthContainer>
        <LayoutGrid>
          <GridItem className={transitions.names.slide} colSpan={{ xxs: 12, md: 8 }}>
            <TitleContainer>
              {video ? (
                <TitleText variant={mdMatch ? 'h600' : 'h400'}>{video.title}</TitleText>
              ) : (
                <SkeletonLoader height={mdMatch ? 56 : 32} width={400} />
              )}
              <Meta variant={mdMatch ? 't300' : 't100'} secondary>
                {video ? (
                  formatVideoViewsAndDate(video.views || null, video.createdAt, { fullViews: true })
                ) : (
                  <SkeletonLoader height={24} width={200} />
                )}
              </Meta>
            </TitleContainer>
            <ChannelContainer>
              <ChannelLink followButton id={channelId} textVariant="h300" avatarSize="small" />
            </ChannelContainer>
            <DetailsWrapper>
              <DescriptionContainer>
                {video ? (
                  video?.description && (
                    <>
                      <DescriptionTitle variant="h100">Description</DescriptionTitle>
                      {video.description?.split('\n').map((line, idx) => (
                        <Text variant={mdMatch ? 't300' : 't200'} secondary key={idx}>
                          {replaceUrls(line)}
                        </Text>
                      ))}
                    </>
                  )
                ) : (
                  <>
                    <DescriptionSkeletonLoader width="70%" />
                    <DescriptionSkeletonLoader width="40%" />
                    <DescriptionSkeletonLoader width="80%" />
                    <DescriptionSkeletonLoader width="30%" />
                  </>
                )}
                {!mdMatch && (
                  <ExpandButton
                    onClick={toggleDetailsExpand}
                    iconPlacement="right"
                    size="small"
                    variant="tertiary"
                    textOnly
                    icon={detailsExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
                  >
                    Show {!detailsExpanded ? 'more' : 'less'}
                  </ExpandButton>
                )}
              </DescriptionContainer>
              <LicenceCategoryWrapper detailsExpanded={!mdMatch ? detailsExpanded : true}>
                <GridItem>
                  {video ? (
                    <>
                      <DescriptionTitle variant="h100">License</DescriptionTitle>
                      {foundLicense && (
                        <Text variant={mdMatch ? 't300' : 't200'} secondary>
                          {foundLicense.name[0].toUpperCase()}
                          {foundLicense.name.slice(1).toLocaleLowerCase()}
                        </Text>
                      )}
                      <Text variant="t100" secondary>
                        {video.license?.customText}
                      </Text>
                    </>
                  ) : (
                    <SkeletonLoader height={12} width={200} />
                  )}
                </GridItem>
                <CategoryWrapper>
                  {video ? (
                    <>
                      <DescriptionTitle variant="h100">Category</DescriptionTitle>
                      <Category to={absoluteRoutes.viewer.category(category?.id)}>
                        {category?.icon}
                        <Text variant={mdMatch ? 't300' : 't200'} secondary>
                          {category?.name}
                        </Text>
                      </Category>
                    </>
                  ) : (
                    <SkeletonLoader height={12} width={200} />
                  )}
                </CategoryWrapper>
              </LicenceCategoryWrapper>
            </DetailsWrapper>
          </GridItem>
          <GridItem colSpan={{ xxs: 12, md: 4 }}>
            <MoreVideos channelId={channelId} channelName={channelName} type="channel" />
            <MoreVideos categoryId={category?.id} categoryName={category?.name} type="category" />
          </GridItem>
        </LayoutGrid>
        <StyledCallToActionWrapper>
          {['popular', 'new', 'discover'].map((item, idx) => (
            <CallToActionButton key={`cta-${idx}`} {...CTA_MAP[item]} />
          ))}
        </StyledCallToActionWrapper>
      </StyledLimitedWidthContainer>
    </>
  )
}
