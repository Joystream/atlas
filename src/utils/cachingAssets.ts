import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'
import { AssetAvailability, VideoFieldsFragment, VideoFieldsFragmentDoc } from '@/api/queries'
import { DocumentNode } from 'graphql'

const cachedCoverUrlFragment = gql`
  fragment CoverUrlField on Channel {
    coverPhotoAvailability
    coverPhotoUrls
  }
`

const cachedAvatarUrlFragment = gql`
  fragment AvatarUrlField on Channel {
    avatarPhotoAvailability
    avatarPhotoUrls
  }
`

const cachedThumbnailUrlFragment = gql`
  fragment ThumbnailUrlField on Video {
    thumbnailPhotoAvailability
    thumbnailPhotoUrls
  }
`

type CachedAssetType = 'avatar' | 'cover' | 'thumbnail'

type WriteUrlInCacheArg = {
  url?: string | null
  fileType: CachedAssetType
  parentId: string | null
  client: ApolloClient<NormalizedCacheObject>
}

type WriteVideoDataCacheArg = {
  data: VideoFieldsFragment
  thumbnailUrl?: string | null
  client: ApolloClient<NormalizedCacheObject>
  isPublic?: boolean | null
}

const FILE_TYPE_FIELDS: Record<CachedAssetType, string[]> = {
  avatar: ['avatarPhotoUrls', 'avatarPhotoAvailability'],
  cover: ['coverPhotoUrls', 'coverPhotoAvailability'],
  thumbnail: ['thumbnailPhotoUrls', 'thumbnailPhotoAvailability'],
}

const FILE_TYPE_FRAGMENT: Record<CachedAssetType, DocumentNode> = {
  avatar: cachedAvatarUrlFragment,
  cover: cachedCoverUrlFragment,
  thumbnail: cachedThumbnailUrlFragment,
}

export const writeUrlInCache = ({ url, fileType, parentId, client }: WriteUrlInCacheArg) => {
  const parentObject = fileType === 'thumbnail' ? 'Video' : 'Channel'
  const updateFields = FILE_TYPE_FIELDS[fileType]
  const fragment = FILE_TYPE_FRAGMENT[fileType]

  client.writeFragment({
    id: `${parentObject}:${parentId}`,
    fragment: fragment,
    data: {
      [updateFields[0]]: url ? [url] : [],
      [updateFields[1]]: AssetAvailability.Accepted,
    },
  })
}

export const writeVideoDataInCache = ({ data, thumbnailUrl, client }: WriteVideoDataCacheArg) => {
  client.cache.modify({
    fields: {
      videos: (existingVideos = []) => {
        const video = client.cache.writeFragment({
          id: `Video:${data.id}`,
          fragment: VideoFieldsFragmentDoc,
          fragmentName: 'VideoFields',
          data: {
            ...data,
            thumbnailPhotoUrls: thumbnailUrl ? [thumbnailUrl] : [],
            thumbnailPhotoAvailability: AssetAvailability.Accepted,
          },
        })
        return [video, ...existingVideos]
      },
    },
  })
}

export const removeVideoFromCache = (videoId: string, client: ApolloClient<NormalizedCacheObject>) => {
  client.cache.modify({
    fields: {
      videos: (existingVideos = []) => {
        client.cache.evict({ id: `Video:${videoId}` })
        return existingVideos.filter((video: VideoFieldsFragment) => video.id !== videoId)
      },
    },
  })
}
