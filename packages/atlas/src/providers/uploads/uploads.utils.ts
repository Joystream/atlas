import { ApolloClient } from '@apollo/client'

import {
  GetFullChannelDocument,
  GetFullChannelQuery,
  GetFullChannelQueryVariables,
} from '@/api/queries/__generated__/channels.generated'
import { FullChannelFieldsFragment, FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  GetFullVideosDocument,
  GetFullVideosQuery,
  GetFullVideosQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { createLookup } from '@/utils/data'

export const fetchMissingAssets = async (
  client: ApolloClient<unknown>,
  channelId: string
): Promise<[FullVideoFieldsFragment[], FullChannelFieldsFragment | null | undefined, Record<string, boolean>]> => {
  const videosMediaPromise = client.query<GetFullVideosQuery, GetFullVideosQueryVariables>({
    query: GetFullVideosDocument,
    variables: {
      where: {
        media: { isAccepted_eq: false },
        channel: { id_eq: channelId },
      },
    },
  })

  const videosThumbnailPromise = client.query<GetFullVideosQuery, GetFullVideosQueryVariables>({
    query: GetFullVideosDocument,
    variables: {
      where: {
        thumbnailPhoto: { isAccepted_eq: false },
        channel: { id_eq: channelId },
      },
    },
  })

  const channelPromise = client.query<GetFullChannelQuery, GetFullChannelQueryVariables>({
    query: GetFullChannelDocument,
    variables: { id: channelId },
  })

  const [videosMediaResponse, videosThumbnailResponse, channelResponse] = await Promise.all([
    videosMediaPromise,
    videosThumbnailPromise,
    channelPromise,
  ])

  const fetchedVideosMedia = videosMediaResponse.data.videos
  const fetchedVideosThumbnail = videosThumbnailResponse.data.videos
  const fetchedChannel = channelResponse.data.channelById

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
