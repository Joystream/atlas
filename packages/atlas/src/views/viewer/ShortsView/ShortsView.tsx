import styled from '@emotion/styled'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useFullVideo } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetBasicVideosConnectionLightweightDocument,
  useGetCuratedHompageVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { ChannelLink, FollowButton } from '@/components/_channel/ChannelLink'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { getPublicCryptoVideoFilter } from '@/config/contentFilter'
import { absoluteRoutes } from '@/config/routes'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { media } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

export const ShortsView = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [forceMuted, setForceMuted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextSlide, setNextSlide] = useState<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const { fetchMore, tiles, loading, pageInfo } = useHomeVideos()

  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5, // Adjust as needed to determine what constitutes "on screen"
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newIndex = Number(entry.target.dataset.index)
          setActiveIndex(newIndex)
          setNextSlide(entries[newIndex + 1].target)
          console.log(tiles.length, tiles.length - newIndex, 'hh')
          if (tiles.length - newIndex <= 2) {
            console.log('try fetch')
            if (!loading) {
              fetchMore({
                variables: { first: 4 * 4, after: pageInfo?.endCursor },
              })
            }
          }
        }
      })
    }, options)

    const placeholders = containerRef.current?.querySelectorAll('.short-video') ?? []
    placeholders.forEach((placeholder) => observerRef.current?.observe(placeholder))

    return () => {
      placeholders.forEach((placeholder) => observerRef.current?.unobserve(placeholder))
      observerRef.current?.disconnect()
    }
  }, [activeIndex, fetchMore, loading, pageInfo?.endCursor, tiles.length])

  const goNextSlide = useCallback(() => {
    nextSlide?.scrollIntoView({ behavior: 'smooth' })
  }, [nextSlide])

  return (
    <Container ref={containerRef}>
      {tiles.map(({ id }, idx) => (
        <ShortVideoPlaceholder
          key={idx}
          data-index={idx}
          className={`short-video ${idx === activeIndex ? 'active' : ''} ${
            activeIndex > idx && idx > activeIndex - 2 ? 'prev' : ''
          } ${activeIndex < idx && idx < activeIndex + 2 ? 'next' : ''}`}
        >
          {!id || activeIndex - 1 > idx || activeIndex + 2 < idx ? (
            <div style={{ height: '100%', background: 'red', width: 400, aspectRatio: '9/16' }} />
          ) : (
            <ShortVideoPlayer
              forceMuted={forceMuted}
              setForceMuted={setForceMuted}
              videoId={id}
              isActive={idx === activeIndex}
              playNext={goNextSlide}
            />
          )}
        </ShortVideoPlaceholder>
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 40px;
  height: 100%;
  scroll-snap-type: y mandatory;
  align-items: center;
  scrollbar-width: none;
  width: calc(100% + 36px);
  margin-left: -16px;

  ::-webkit-scrollbar {
    display: none;
  }
`

const ShortVideoPlaceholder = styled.div`
  display: grid;
  place-items: center;
  aspect-ratio: 9/16;
  max-height: 100%;
  min-height: 100%;
  min-width: 300px;
  width: 100%;
  scroll-snap-stop: always;
  scroll-snap-align: center;

  ${media.xs} {
    width: 400px;
  }

  ${media.sm} {
    width: 500px;
  }

  ${media.xxl} {
    width: 40vw;
    height: 100%;
  }
`

const ShortVideoPlayer = ({
  videoId,
  isActive,
  forceMuted,
  playNext,
  setForceMuted,
}: {
  isActive: boolean
  videoId: string
  forceMuted: boolean
  setForceMuted: (val: boolean) => void
  playNext: () => void
}) => {
  const { video, loading } = useFullVideo(videoId)
  const mediaUrls: string[] = video?.media?.resolvedUrls ?? []

  return (
    <ShortVideoPlayerBox>
      {!loading ? (
        <StyledBackgroundVideoPlayer
          videoId={videoId}
          playing={isActive}
          muted={forceMuted}
          onMuted={setForceMuted}
          preload="metadata"
          withFade
          src={mediaUrls ?? undefined}
          poster={[] ?? undefined}
          handleActions={isActive}
          videoPlaytime={10}
          loop
          onEnded={playNext}
          customLink={absoluteRoutes.viewer.video(videoId)}
        />
      ) : (
        <SkeletonLoader height="100%" width={400} />
      )}
      <DetailsBox flow="column" gap={2}>
        <FlexBox width="fit-content" gap={4}>
          <ChannelLink id={video?.channel.id} />
          <FollowButton isSmall channelId={video?.channel.id} />
        </FlexBox>
        <Text variant="t200" as="p">
          {video?.title}
        </Text>
        <Text clampAfterLine={1} variant="t100" as="p" color="colorText">
          {video?.description}
        </Text>
      </DetailsBox>
    </ShortVideoPlayerBox>
  )
}

const DetailsBox = styled(FlexBox)`
  position: absolute;
  bottom: 30px;
  left: 10px;
  max-width: 80%;
  overflow: hidden;
`

const ShortVideoPlayerBox = styled.div`
  aspect-ratio: 9/16;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  position: relative;
  scroll-snap-stop: always;
  scroll-snap-align: center;
  overflow: hidden;

  ${media.md} {
    min-height: 95%;
    max-height: 95%;
  }

  ${media.xxl} {
    width: 40vw;
  }
`

const StyledBackgroundVideoPlayer = styled(BackgroundVideoPlayer)``

export const useHomeVideos = () => {
  const { data, loading } = useGetCuratedHompageVideosQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where: getPublicCryptoVideoFilter({
        orionLanguage_in: undefined,
        includeInHomeFeed_eq: true,
        isShort_not_eq: undefined,
        isShortDerived_isNull: undefined,
        isShort_eq: true,
        isShortDerived_eq: true,
      }),
      skipVideoIds: ['-1'],
    },
  })
  const avoidIds = data?.dumbPublicFeedVideos ? data.dumbPublicFeedVideos?.map((video) => video.id) : undefined
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: {
        OR: [
          getPublicCryptoVideoFilter({
            id_not_in: avoidIds,
            isShort_not_eq: undefined,
            isShortDerived_isNull: undefined,
            isShort_eq: true,
            orionLanguage_eq: 'en',
          }),
          getPublicCryptoVideoFilter({
            id_not_in: avoidIds,
            isShort_not_eq: undefined,
            isShortDerived_isNull: undefined,
            isShortDerived_eq: true,
            orionLanguage_eq: 'en',
          }),
        ],
      },
      orderBy: VideoOrderByInput.VideoRelevanceDesc,
    },
    options: {
      skip: !avoidIds,
    },
  })

  const firstLoad = !data?.dumbPublicFeedVideos && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * 3) : []

  const displayedItems = [...(data?.dumbPublicFeedVideos || []), ...(tiles || [])]

  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems],
    fetchMore,
    columns,
    loading,
    pageInfo,
  }
}
