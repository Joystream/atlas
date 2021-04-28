import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'

type ReadUrlFromCacheArg = {
  fileType: 'avatar' | 'cover'
  channelId: string | null
  client: ApolloClient<NormalizedCacheObject>
}

type WriteUrlInCacheArg = {
  url: string | null
} & ReadUrlFromCacheArg

const fragment = gql`
  fragment ChannelFileUrlsFields on Channel {
    cachedAvatarUrl
    cachedCoverUrl
  }
`

export const writeUrlInCache: (arg: WriteUrlInCacheArg) => void = ({ url, fileType, channelId, client }) => {
  const field = fileType === 'avatar' ? 'cachedAvatarUrl' : 'cachedCoverUrl'
  client.writeFragment({
    id: `Channel:${channelId}`,
    fragment,
    data: {
      [field]: url,
    },
  })
}

export const readUrlFromCache: (arg: ReadUrlFromCacheArg) => string = ({ fileType, channelId, client }) => {
  const field = fileType === 'avatar' ? 'cachedAvatarUrl' : 'cachedCoverUrl'
  const fields = client.readFragment({
    id: `Channel:${channelId}`,
    fragment,
  })
  return fields?.[field]
}
