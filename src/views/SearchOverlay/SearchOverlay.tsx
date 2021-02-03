import React, { useState, useEffect } from 'react'
import { RouteComponentProps, navigate } from '@reach/router'

import { client } from '@/api'
import { GET_VIDEO, GET_CHANNEL } from '@/api/queries'
import { GetVideo, GetVideo_video } from '@/api/queries/__generated__/GetVideo'
import { GetChannel, GetChannel_channel } from '@/api/queries/__generated__/GetChannel'
import { usePersonalData } from '@/hooks'
import routes from '@/config/routes'
import { Container, Title, SearchesList, SmallChannelPreview, SmallVideoPreview } from './SearchOverlay.style'
import { RecentSearch } from '@/hooks/usePersonalData/localStorageClient'

type ResolvedSearch = GetVideo_video | GetChannel_channel | null
type FetchChannelsAndVideos = (recentSearches: RecentSearch[]) => Promise<ResolvedSearch[]>
const fetchChannelsAndVideos: FetchChannelsAndVideos = async (recentSearches: RecentSearch[]) => {
  return await Promise.all(
    recentSearches.map(async (search) => {
      const query = search.type === 'video' ? GET_VIDEO : GET_CHANNEL
      const { data } = await client.query<GetVideo | GetChannel>({ query, variables: { id: search.id } })
      return 'video' in data ? data.video : data.channel
    })
  )
}

type OverlayProps = RouteComponentProps

const Overlay: React.FC<OverlayProps> = () => {
  const {
    state: { recentSearches: recentSearchesIds },
  } = usePersonalData()
  const [recentSearches, setRecentSearches] = useState<ResolvedSearch[]>()

  useEffect(() => {
    fetchChannelsAndVideos(recentSearchesIds)
      .then((resolvedSearches) => setRecentSearches(resolvedSearches))
      .catch((e) => {
        console.error(e)
        console.error(`Couldn't fetch recent searches.`)
      })
  }, [recentSearchesIds])

  console.log({ recentSearchesIds, recentSearches })

  return (
    <Container>
      <Title variant="hero">Recent Searches</Title>
      {recentSearches != null && recentSearches.length > 0 && (
        <SearchesList>
          {recentSearches.map((recentSearch) => {
            if (recentSearch?.__typename == null) {
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
                handle={recentSearch.handle}
                avatarPhotoUrl={recentSearch.avatarPhotoUrl}
                onClick={() => navigate(routes.channel(recentSearch.id))}
              />
            )
          })}
        </SearchesList>
      )}
    </Container>
  )
}

export default Overlay
