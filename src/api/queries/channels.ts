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
    follows
  }
`

export const GET_CHANNELS_CONNECTION = gql`
  query GetChannelsConnection($first: Int, $after: String) {
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

export const FOLLOW_CHANNEL = gql`
  mutation FollowChannel($channelId: ID!) {
    followChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export const UNFOLLOW_CHANNEL = gql`
  mutation UnfollowChannel($channelId: ID!) {
    unfollowChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
