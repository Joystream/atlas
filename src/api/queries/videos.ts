import gql from 'graphql-tag'
import { basicChannelFieldsFragment } from './channels'

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
const licenseFieldsFragment = gql`
  fragment LicenseFields on LicenseEntity {
    id
    attribution
    type {
      ... on KnownLicense {
        code
        url
      }
      ... on UserDefinedLicense {
        content
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
    license {
      ...LicenseFields
    }
  }
  ${videoMediaFieldsFragment}
  ${licenseFieldsFragment}
`

export const GET_VIDEOS_CONNECTION = gql`
  query GetVideosConnection(
    $first: Int
    $after: String
    $categoryId: ID
    $channelId: ID
    $channelIdIn: [ID]
    $createdAtGte: Date
    $orderBy: VideoOrderByInput
  ) {
    videosConnection(
      first: $first
      after: $after
      where: {
        categoryId_eq: $categoryId
        channelId_eq: $channelId
        isCurated_eq: false
        channelId_in: $channelIdIn
        createdAt_gte: $createdAtGte
      }
      orderBy: $orderBy
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

export const GET_VIDEOS_WITH_IDS = gql`
  query GetVideosWithIds($ids: [ID!]!) {
    videos(where: { id_in: $ids }) {
      ...VideoFields
    }
  }
  ${videoFieldsFragment}
`

export const GET_FEATURED_VIDEOS = gql`
  query GetFeaturedVideos {
    featuredVideos(orderBy: createdAt_DESC) {
      video {
        ...VideoFields
      }
    }
  }
  ${videoFieldsFragment}
`

export const GET_COVER_VIDEO = gql`
  query GetCoverVideo {
    coverVideo {
      video {
        ...VideoFields
      }
      coverDescription
      coverCutMedia {
        ...VideoMediaFields
      }
    }
  }
  ${videoFieldsFragment}
  ${videoMediaFieldsFragment}
`

export const GET_VIDEO = gql`
  query GetVideo($id: ID!) {
    video(where: { id: $id }) {
      ...VideoFields
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${videoFieldsFragment}
  ${basicChannelFieldsFragment}
`

export const ADD_VIDEO_VIEW = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!) {
    addVideoView(videoId: $videoId, channelId: $channelId) {
      id
      views
    }
  }
`
