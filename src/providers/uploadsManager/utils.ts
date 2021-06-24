import { ApolloClient } from '@apollo/client'

import {
  AllChannelFieldsFragment,
  AssetAvailability,
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
    variables: { where: { mediaAvailability_eq: AssetAvailability.Pending, channelId_eq: activeChannelId } },
  })

  const videosThumbnailPromise = client.query<GetVideosQuery, GetVideosQueryVariables>({
    query: GetVideosDocument,
    variables: {
      where: { thumbnailPhotoAvailability_eq: AssetAvailability.Pending, channelId_eq: activeChannelId },
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
    if (cur.mediaAvailability === AssetAvailability.Pending && cur.mediaDataObject?.joystreamContentId) {
      acc[cur.mediaDataObject.joystreamContentId] = true
    }
    if (
      cur.thumbnailPhotoAvailability === AssetAvailability.Pending &&
      cur.thumbnailPhotoDataObject?.joystreamContentId
    ) {
      acc[cur.thumbnailPhotoDataObject.joystreamContentId] = true
    }
    return acc
  }, {} as Record<string, boolean>)

  const pendingChannelAssetsLookup = {
    ...(fetchedChannel?.avatarPhotoAvailability === AssetAvailability.Pending &&
    fetchedChannel.avatarPhotoDataObject?.joystreamContentId
      ? { [fetchedChannel.avatarPhotoDataObject.joystreamContentId]: true }
      : {}),
    ...(fetchedChannel?.coverPhotoAvailability === AssetAvailability.Pending &&
    fetchedChannel.coverPhotoDataObject?.joystreamContentId
      ? { [fetchedChannel.coverPhotoDataObject.joystreamContentId]: true }
      : {}),
  }
  const pendingAssetsLookup = {
    ...pendingVideoAssetsLookup,
    ...pendingChannelAssetsLookup,
  }

  return [fetchedVideos, fetchedChannel, pendingAssetsLookup]
}
