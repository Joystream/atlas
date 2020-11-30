import gql from 'graphql-tag'

const videoMediaFieldsFragment = gql`
  fragment VideoMediaFields on VideoMedia {
    id
    pixelHeight
    pixelWidth
    location {
      ... on HttpMediaLocation {
        url
      }
      ... on JoystreamMediaLocation {
        dataObjectId
      }
    }
  }
`

export const videoFieldsFragment = gql`
  fragment VideoFields on Video {
    id
    title
    description
    category {
      id
    }
    views
    duration
    thumbnailUrl
    createdAt
    media {
      ...VideoMediaFields
    }
    channel {
      id
      avatarPhotoUrl
      handle
    }
  }
  ${videoMediaFieldsFragment}
`

export const GET_NEWEST_VIDEOS = gql`
  query GetNewestVideos($first: Int, $after: String, $categoryId: ID, $channelId: ID) {
    videosConnection(
      first: $first
      after: $after
      where: { categoryId_eq: $categoryId, channelId_eq: $channelId, isCurated_eq: false }
      orderBy: createdAt_DESC
    ) {
      edges {
        cursor
        node {
          ...VideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${videoFieldsFragment}
`

export const GET_FEATURED_VIDEOS = gql`
  query GetFeaturedVideos {
    featured_videos {
      ...VideoFields
    }
  }
  ${videoFieldsFragment}
`

export const GET_VIDEO = gql`
  query GetVideo($id: ID!) {
    video(where: { id: $id }) {
      ...VideoFields
      channel {
        id
        avatarPhotoUrl
        handle
      }
    }
  }
  ${videoFieldsFragment}
`

export const ADD_VIDEO_VIEW = gql`
  mutation AddVideoView($id: ID!) {
    addVideoView(videoID: $id) {
      id
      views
    }
  }
`
