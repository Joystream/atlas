import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'
import { AssetAvailability, VideoFieldsFragment, Maybe } from '@/api/queries'
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

const cachedVideoDataFragment = gql`
  fragment CachedVideoFields on Video {
    id
    title
    views
    createdAt
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
  data: Maybe<
    {
      __typename?: 'Video' | undefined
    } & VideoFieldsFragment
  >
  videoId: string
  thumbnailUrl?: string | null
  client: ApolloClient<NormalizedCacheObject>
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

export const writeVideoDataInCache = ({ data, videoId, thumbnailUrl, client }: WriteVideoDataCacheArg) => {
  const { id, title, views, createdAt } = data as VideoFieldsFragment
  client.writeFragment({
    id: `Video:${videoId}`,
    fragment: cachedVideoDataFragment,
    data: {
      id,
      title,
      views,
      createdAt,
      thumbnailPhotoUrls: thumbnailUrl ? [thumbnailUrl] : [],
      thumbnailPhotoAvailability: AssetAvailability.Accepted,
    },
  })
}
