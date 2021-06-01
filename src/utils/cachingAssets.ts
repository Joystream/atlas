import { ApolloClient, gql, Reference } from '@apollo/client'
import { AssetAvailability, VideoEdge, VideoFieldsFragment, VideoFieldsFragmentDoc } from '@/api/queries'
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
  client: ApolloClient<object>
}

type WriteVideoDataCacheArg = {
  edge: {
    cursor: string
    node: VideoFieldsFragment
  }
  thumbnailUrl?: string | null
  client: ApolloClient<object>
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

export const writeVideoDataInCache = ({ edge, thumbnailUrl, client }: WriteVideoDataCacheArg) => {
  const video = client.cache.writeFragment({
    id: `Video:${edge.node.id}`,
    fragment: VideoFieldsFragmentDoc,
    fragmentName: 'VideoFields',
    data: {
      ...edge.node,
      thumbnailPhotoUrls: thumbnailUrl ? [thumbnailUrl] : [],
      thumbnailPhotoAvailability: AssetAvailability.Accepted,
    },
  })
  client.cache.modify({
    fields: {
      videosConnection: (existingVideos = {}) => {
        return {
          ...existingVideos,
          totalCount: existingVideos.totalCount + 1,
          edges: [{ ...edge, node: video }, ...(existingVideos?.edges ? existingVideos.edges : [])],
        }
      },
    },
  })
}

type NormalizedVideoEdge = Omit<VideoEdge, 'node'> & {
  node: Reference
}

export const removeVideoFromCache = (videoId: string, client: ApolloClient<object>) => {
  client.cache.evict({ id: `Video:${videoId}` })
  client.cache.modify({
    fields: {
      videos: (existingVideos = []) => {
        return existingVideos.filter((video: VideoFieldsFragment) => video.id !== videoId)
      },
      videosConnection: (existing = {}, opts) => {
        return (
          existing && {
            ...existing,
            totalCount: existing.edges.find((edge: NormalizedVideoEdge) => edge.node.__ref === `Video:${videoId}`)
              ? existing.totalCount - 1
              : existing.totalCount,
            edges: existing.edges.filter((edge: NormalizedVideoEdge) => edge.node.__ref !== `Video:${videoId}`),
          }
        )
      },
    },
  })
}
