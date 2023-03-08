import { ApolloClient, Reference } from '@apollo/client'

import { VideoEdge } from '@/api/queries/__generated__/baseTypes.generated'
import { FullVideoFieldsFragment, FullVideoFieldsFragmentDoc } from '@/api/queries/__generated__/fragments.generated'

type WriteVideoDataCacheArg = {
  edge: {
    cursor: string
    node: FullVideoFieldsFragment
  }
  thumbnailUrl?: string | null
  client: ApolloClient<object>
}

export const modifyAssetUrlInCache = (client: ApolloClient<object>, assetId: string, assetUrl: string) => {
  client.cache.modify({
    id: `StorageDataObject:${assetId}`,
    fields: {
      resolvedUrl: (result) => {
        return assetUrl || result
      },
    },
  })
}

export const writeVideoDataInCache = ({ edge, client }: WriteVideoDataCacheArg) => {
  const video = client.cache.writeFragment({
    id: `Video:${edge.node.id}`,
    fragment: FullVideoFieldsFragmentDoc,
    fragmentName: 'FullVideoFields',
    data: edge.node,
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
  const videoRef = `Video:${videoId}`
  client.cache.modify({
    fields: {
      videos: (existingVideos = []) => {
        return existingVideos.filter((video: FullVideoFieldsFragment) => video.id !== videoId)
      },
      videosConnection: (existing = {}) => {
        return (
          existing && {
            ...existing,
            totalCount: existing.edges.find((edge: NormalizedVideoEdge) => edge.node.__ref === videoRef)
              ? existing.totalCount - 1
              : existing.totalCount,
            edges: existing.edges.filter((edge: NormalizedVideoEdge) => edge.node.__ref !== videoRef),
          }
        )
      },
    },
  })
  client.cache.evict({ id: videoRef })
}
