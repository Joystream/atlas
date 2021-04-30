import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client'
import { AssetAvailability } from '@/api/queries'

type WriteUrlInCacheArg = {
  url: string | null
  fileType: 'avatar' | 'cover'
  channelId: string | null
  client: ApolloClient<NormalizedCacheObject>
}

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

export const writeUrlInCache = ({ url, fileType, channelId, client }: WriteUrlInCacheArg) => {
  const field =
    fileType === 'avatar'
      ? ['avatarPhotoUrls', 'avatarPhotoAvailability']
      : ['coverPhotoUrls', 'coverPhotoAvailability']
  client.writeFragment({
    id: `Channel:${channelId}`,
    fragment: fileType === 'avatar' ? cachedAvatarUrlFragment : cachedCoverUrlFragment,
    data: {
      [field[0]]: [url],
      [field[1]]: AssetAvailability.Accepted,
    },
  })
}
