import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import {
  ChannelContainer,
  Container,
  DescriptionContainer,
  DescriptionPlaceholder,
  InfoContainer,
  Meta,
  MoreVideosContainer,
  MoreVideosHeader,
  PlayerContainer,
  PlayerPlaceholder,
  PlayerWrapper,
  LicenseContainer,
} from './VideoView.style'
import { InfiniteVideoGrid, Placeholder, VideoPlayer, Text } from '@/shared/components'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VIDEO_VIEW, GET_VIDEO } from '@/api/queries'
import { GetVideo, GetVideoVariables } from '@/api/queries/__generated__/GetVideo'
import { formatVideoViewsAndDate } from '@/utils/video'
import { AddVideoView, AddVideoViewVariables } from '@/api/queries/__generated__/AddVideoView'
import { ChannelLink } from '@/components'

const VideoView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { loading, data, error } = useQuery<GetVideo, GetVideoVariables>(GET_VIDEO, {
    variables: { id },
  })
  const [addVideoView] = useMutation<AddVideoView, AddVideoViewVariables>(ADD_VIDEO_VIEW)

  const videoID = data?.video?.id

  const [playing, setPlaying] = useState<boolean>(true)
  const handleUserKeyPress = useCallback((event: Event) => {
    const { keyCode } = event as KeyboardEvent
    if (keyCode === 32) {
      event.preventDefault()
      setPlaying((prevState) => !prevState)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [handleUserKeyPress])

  useEffect(() => {
    if (!videoID) {
      return
    }
    addVideoView({
      variables: { id: videoID },
      update: (cache, mutationResult) => {
        cache.modify({
          id: cache.identify({
            __typename: 'Video',
            id: videoID,
          }),
          fields: {
            views: () => mutationResult.data?.addVideoView.views,
          },
        })
      },
    }).catch((error) => {
      console.warn('Failed to increase video views', { error })
    })
  }, [addVideoView, videoID])

  if (error) {
    throw error
  }

  if (!loading && !data?.video) {
    return <p>Video not found</p>
  }

  return (
    <Container>
      <PlayerWrapper>
        <PlayerContainer>
          {data?.video ? (
            <VideoPlayer
              playing={playing}
              src={data.video.media.location}
              autoplay
              fluid
              posterUrl={data.video.thumbnailUrl}
            />
          ) : (
            <PlayerPlaceholder />
          )}
        </PlayerContainer>
      </PlayerWrapper>
      <InfoContainer>
        {data?.video ? <Text variant="h2">{data.video.title}</Text> : <Placeholder height={46} width={400} />}
        <Meta>
          {data?.video ? (
            formatVideoViewsAndDate(data.video.views, data.video.createdAt, { fullViews: true })
          ) : (
            <Placeholder height={18} width={200} />
          )}
        </Meta>
        <ChannelContainer>
          <ChannelLink id={data?.video?.channel.id} />
        </ChannelContainer>
        <DescriptionContainer>
          {data?.video ? (
            <>
              {data.video.description.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </>
          ) : (
            <>
              <DescriptionPlaceholder width={700} />
              <DescriptionPlaceholder width={400} />
              <DescriptionPlaceholder width={800} />
              <DescriptionPlaceholder width={300} />
            </>
          )}
        </DescriptionContainer>
        <LicenseContainer>
          {data?.video ? (
            <>
              <p>
                License:{' '}
                {data.video.license.type.__typename === 'KnownLicense' ? (
                  <a href={data.video.license.type.url || ''} target="_blank" rel="noopener noreferrer">
                    {data.video.license.type.code}
                  </a>
                ) : (
                  data.video.license.type.content
                )}
              </p>
              {data.video.license?.attribution ? <p>Attribution: {data.video.license.attribution}</p> : null}
            </>
          ) : (
            <Placeholder height={12} width={200} />
          )}
        </LicenseContainer>
        <MoreVideosContainer>
          <MoreVideosHeader>
            {data?.video ? `More from ${data.video.channel.handle}` : <Placeholder height={23} width={300} />}
          </MoreVideosHeader>
          <InfiniteVideoGrid ready={!loading} channelId={data?.video?.channel.id} showChannel={false} />
        </MoreVideosContainer>
      </InfoContainer>
    </Container>
  )
}

export default VideoView
