import gql from 'graphql-tag'
import { videoFieldsFragment } from './videos'
import { channelFieldsFragment } from './channels'

export const SEARCH = gql`
  query Search($text: String!) {
    search(text: $text) {
      item {
        ... on Video {
          ...VideoFields
        }
        ... on Channel {
          ...ChannelFields
        }
      }
      rank
    }
  }
  ${channelFieldsFragment}
  ${videoFieldsFragment}
`
