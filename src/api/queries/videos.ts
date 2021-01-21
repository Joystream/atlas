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

export const GET_VIDEOS_WITH_IDS = gql`
  query GetVideosWithIds($ids: [ID!]!) {
    videosConnection(where: { id_in: $ids }) {
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
