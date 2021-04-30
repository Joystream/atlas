import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'

type WriteUrlInCacheArg = {
  url: string | null
  fileType: 'avatar' | 'cover'
  channelId: string | null
  client: ApolloClient<NormalizedCacheObject>
}

const cachedCoverUrlFragment = gql`
  fragment CoverUrlField on Channel {
    coverPhotoUrls
  }
`

const cachedAvatarUrlFragment = gql`
  fragment AvatarUrlField on Channel {
    avatarPhotoUrls
  }
`

export const writeUrlInCache = ({ url, fileType, channelId, client }: WriteUrlInCacheArg) => {
  const field = fileType === 'avatar' ? 'avatarPhotoUrls' : 'coverPhotoUrls'
  client.writeFragment({
    id: `Channel:${channelId}`,
    fragment: fileType === 'avatar' ? cachedAvatarUrlFragment : cachedCoverUrlFragment,
    data: {
      [field]: [url],
    },
  })
}
