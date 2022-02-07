import { ApolloClient } from '@apollo/client'

import {
  AllChannelFieldsFragment,
  GetChannelDocument,
  GetChannelQuery,
  GetChannelQueryVariables,
  GetVideosDocument,
  GetVideosQuery,
  GetVideosQueryVariables,
  VideoFieldsFragment,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

export const fetchMissingAssets = async (
  client: ApolloClient<unknown>,
  activeChannelId: string
): Promise<[VideoFieldsFragment[], AllChannelFieldsFragment | null | undefined, Record<string, boolean>]> => {
  const videosMediaPromise = client.query<GetVideosQuery, GetVideosQueryVariables>({
    query: GetVideosDocument,
    variables: {
      where: {
        media: { isAccepted_eq: false },
        channel: { id_eq: activeChannelId },
      },
    },
  })

  const videosThumbnailPromise = client.query<GetVideosQuery, GetVideosQueryVariables>({
    query: GetVideosDocument,
    variables: {
      where: {
        thumbnailPhoto: { isAccepted_eq: false },
        channel: { id_eq: activeChannelId },
      },
    },
  })

  const channelPromise = client.query<GetChannelQuery, GetChannelQueryVariables>({
    query: GetChannelDocument,
    variables: { where: { id: activeChannelId } },
  })

  const [videosMediaResponse, videosThumbnailResponse, channelResponse] = await Promise.all([
    videosMediaPromise,
    videosThumbnailPromise,
    channelPromise,
  ])

  const fetchedVideosMedia = videosMediaResponse.data.videos
  const fetchedVideosThumbnail = videosThumbnailResponse.data.videos
  const fetchedChannel = channelResponse.data.channelByUniqueInput

  // to remove any duplicates
  const fetchedVideosMediaLookup = createLookup(fetchedVideosMedia || [])
  const fetchedVideosThumbnailLookup = createLookup(fetchedVideosThumbnail || [])
  const fetchedVideos = Object.values({
    ...fetchedVideosMediaLookup,
    ...fetchedVideosThumbnailLookup,
  })

  const pendingVideoAssetsLookup = fetchedVideos.reduce((acc, cur) => {
    if (cur.media && !cur.media.isAccepted) {
      acc[cur.media.id] = true
    }
    if (cur.thumbnailPhoto && !cur.thumbnailPhoto.isAccepted) {
      acc[cur.thumbnailPhoto.id] = true
    }
    return acc
  }, {} as Record<string, boolean>)

  const pendingChannelAssetsLookup: Record<string, boolean> = {}
  if (fetchedChannel?.avatarPhoto && !fetchedChannel?.avatarPhoto.isAccepted) {
    pendingChannelAssetsLookup[fetchedChannel.avatarPhoto.id] = true
  }
  if (fetchedChannel?.coverPhoto && !fetchedChannel?.coverPhoto.isAccepted) {
    pendingChannelAssetsLookup[fetchedChannel.coverPhoto.id] = true
  }
  const pendingAssetsLookup = {
    ...pendingVideoAssetsLookup,
    ...pendingChannelAssetsLookup,
  }

  return [fetchedVideos, fetchedChannel, pendingAssetsLookup]
}
