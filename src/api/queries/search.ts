import gql from 'graphql-tag'
import { videoFieldsFragment } from './videos'
import { basicChannelFieldsFragment } from './channels'

export const SEARCH = gql`
  query Search($text: String!) {
    search(text: $text) {
      item {
        ... on Video {
          ...VideoFields
        }
        ... on Channel {
          ...BasicChannelFields
        }
      }
      rank
    }
  }
  ${basicChannelFieldsFragment}
  ${videoFieldsFragment}
`
