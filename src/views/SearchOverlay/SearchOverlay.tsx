import React, { useMemo } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'
import { useQuery } from '@apollo/client'

import { GET_VIDEOS_WITH_IDS, GET_CHANNELS_WITH_IDS } from '@/api/queries'
import { GetVideos } from '@/api/queries/__generated__/GetVideos'
import { GetChannels } from '@/api/queries/__generated__/GetChannels'
import { usePersonalData } from '@/hooks'
import routes from '@/config/routes'
import { Container, Title, SearchesList, SmallChannelPreview, SmallVideoPreview } from './SearchOverlay.style'

type OverlayProps = RouteComponentProps

const Overlay: React.FC<OverlayProps> = () => {
  const {
    state: { recentSearches },
  } = usePersonalData()

  const { videoIds, channelIds } = useMemo(
    () => ({
      videoIds: recentSearches.flatMap((s) => (s.type === 'video' ? s.id : [])),
      channelIds: recentSearches.flatMap((s) => (s.type === 'channel' ? s.id : [])),
    }),
    [recentSearches]
  )

  const { data: videoData, loading: loadingVideos } = useQuery<GetVideos>(GET_VIDEOS_WITH_IDS, {
    variables: { ids: videoIds },
    skip: videoIds.length === 0,
  })
  const { data: channelData, loading: loadingChannels } = useQuery<GetChannels>(GET_CHANNELS_WITH_IDS, {
    variables: { ids: channelIds },
    skip: channelIds.length === 0,
  })

  const recentSearchesResolved = useMemo(
    () =>
      recentSearches.flatMap((s) => {
        if (s.type === 'video') {
          return videoData?.videos ? videoData.videos.find((v) => v.id === s.id) : []
        } else if (s.type === 'channel') {
          return channelData?.channels ? channelData.channels.find((c) => c.id === s.id) : []
        }
      }),
    [channelData, recentSearches, videoData]
  )

  return (
    <Container>
      <Title variant="hero">Recent Searches</Title>
      {
        <SearchesList>
          {!loadingVideos &&
            !loadingChannels &&
            recentSearchesResolved.map((recentSearch) => {
              if (!recentSearch?.__typename) {
                return null
              }
              return recentSearch.__typename === 'Video' ? (
                <SmallVideoPreview
                  key={recentSearch.id}
                  title={recentSearch.title}
                  thumbnailUrl={recentSearch.thumbnailUrl}
                  onClick={() => navigate(routes.video(recentSearch.id))}
                />
              ) : (
                <SmallChannelPreview
                  key={recentSearch.id}
                  handle={recentSearch.handle}
                  avatarPhotoUrl={recentSearch.avatarPhotoUrl}
                  onClick={() => navigate(routes.channel(recentSearch.id))}
                />
              )
            })}
        </SearchesList>
      }
    </Container>
  )
}

export default Overlay
