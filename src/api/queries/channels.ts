import gql from 'graphql-tag'

export const basicChannelFieldsFragment = gql`
  fragment BasicChannelFields on Channel {
    id
    handle
    avatarPhotoUrl
  }
`

export const allChannelFieldsFragment = gql`
  fragment AllChannelFields on Channel {
    id
    handle
    avatarPhotoUrl
    coverPhotoUrl
    followers
  }
`

export const GET_NEWEST_CHANNELS = gql`
  query GetNewestChannels($first: Int, $after: String) {
    channelsConnection(first: $first, after: $after, orderBy: createdAt_DESC) {
      edges {
        cursor
        node {
          ...AllChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${allChannelFieldsFragment}
`

export const GET_CHANNEL = gql`
  query GetChannel($id: ID!) {
    channel(where: { id: $id }) {
      ...AllChannelFields
    }
  }
  ${allChannelFieldsFragment}
`
