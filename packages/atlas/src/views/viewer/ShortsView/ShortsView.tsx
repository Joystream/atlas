import styled from '@emotion/styled'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useFullVideo } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetBasicVideosConnectionLightweightDocument,
  useGetCuratedHompageVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
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

          if (tiles.length - newIndex < 2) {
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
  console.log('enext', nextSlide)
  const goNextSlide = useCallback(() => {
    console.log(nextSlide, 'scroll')
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
  width: 100%;

  ::-webkit-scrollbar {
    display: none;
  }
`

const ShortVideoPlaceholder = styled.div`
  display: grid;
  place-items: center;
  aspect-ratio: 9/16;

  /* background-color: green; */
  max-height: 90%;
  width: 400px;
  text-align: center;
  vertical-align: middle;
  scroll-snap-stop: always;
  scroll-snap-align: center;

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
  const thumbnailUrls: string[] = video?.thumbnailPhoto?.resolvedUrls ?? []
  const mediaUrls: string[] = video?.media?.resolvedUrls ?? []
  const isLoading = loading
  console.log(loading)
  return (
    <ShortVideoPlayerBox>
      {!isLoading ? (
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
        // <VideoWrapper>
        //   <VideoPoster resolvedUrls={thumbnailUrls ?? undefined} type="cover" alt="" />
        // </VideoWrapper>
      )}
    </ShortVideoPlayerBox>
  )
}

const ShortVideoPlayerBox = styled.div`
  aspect-ratio: 9/16;

  /* background-color: green; */
  min-height: 90%;
  max-height: 100%;
  width: 100%;
  position: relative;
  scroll-snap-stop: always;
  scroll-snap-align: center;
  border: 1px solid red;
  overflow: hidden;

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
      }),
      skipVideoIds: ['-1'],
    },
  })
  const avoidIds = data?.dumbPublicFeedVideos ? data.dumbPublicFeedVideos?.map((video) => video.id) : undefined
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: getPublicCryptoVideoFilter({
        id_not_in: avoidIds,
        isShort_not_eq: undefined,
        isShortDerived_isNull: undefined,
        isShort_eq: true,
      }),
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
