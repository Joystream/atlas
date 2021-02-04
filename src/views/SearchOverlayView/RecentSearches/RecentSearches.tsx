import React, { useMemo } from 'react'
import { Container, SearchesList, SmallChannelPreview, SmallVideoPreview, Title } from './RecentSearches.style'
import { navigate } from '@reach/router'
import routes from '@/config/routes'
import { usePersonalData } from '@/hooks'
import { useVideos } from '@/api/hooks'
import { useChannels } from '@/api/hooks/channel'

const RecentSearches: React.FC = () => {
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

  const { videos, loading: videosLoading } = useVideos({ id_in: videoIds }, { skip: !videoIds.length })
  const { channels, loading: channelsLoading } = useChannels({ id_in: channelIds }, { skip: !channelIds.length })

  const recentSearchesResolved = useMemo(
    () =>
      recentSearches.flatMap((s) => {
        if (s.type === 'video') {
          return videos ? videos.find((v) => v.id === s.id) : []
        } else if (s.type === 'channel') {
          return channels ? channels.find((c) => c.id === s.id) : []
        }
      }),
    [videos, channels, recentSearches]
  )

  return (
    <Container>
      <Title variant="hero">Recent Searches</Title>
      {
        <SearchesList>
          {!videosLoading &&
            !channelsLoading &&
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

export default RecentSearches
