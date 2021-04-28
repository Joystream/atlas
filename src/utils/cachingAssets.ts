import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'

type ReadUrlFromCacheArg = {
  fileType: 'avatar' | 'cover'
  channelId: string | null
  client: ApolloClient<NormalizedCacheObject>
}

type WriteUrlInCacheArg = {
  url: string | null
} & ReadUrlFromCacheArg

const cachedCoverUrlFragment = gql`
  fragment CoverUrlField on Channel {
    cachedCoverUrl
  }
`

const cachedAvatarUrlFragment = gql`
  fragment AvatarUrlField on Channel {
    cachedAvatarUrl
  }
`

export const writeUrlInCache: (arg: WriteUrlInCacheArg) => void = ({ url, fileType, channelId, client }) => {
  const field = fileType === 'avatar' ? 'cachedAvatarUrl' : 'cachedCoverUrl'
  client.writeFragment({
    id: `Channel:${channelId}`,
    fragment: fileType === 'avatar' ? cachedAvatarUrlFragment : cachedCoverUrlFragment,
    data: {
      [field]: url,
    },
  })
}

export const readUrlFromCache: (arg: ReadUrlFromCacheArg) => string = ({ fileType, channelId, client }) => {
  const field = fileType === 'avatar' ? 'cachedAvatarUrl' : 'cachedCoverUrl'
  const fields = client.readFragment({
    id: `Channel:${channelId}`,
    fragment: fileType === 'avatar' ? cachedAvatarUrlFragment : cachedCoverUrlFragment,
  })
  return fields?.[field]
}
