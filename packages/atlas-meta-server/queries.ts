import { gql } from 'graphql-request'

export const workerQuery = gql`
  {
    workers(where: { isActive_eq: true, metadata_contains: "https" }, limit: 100) {
      metadata
    }
  }
`

export const videoQuery = (id: string) => gql`
    {
      videos(where: { id_eq: ${id} }) {
        id
        title
        description
        thumbnailPhotoDataObject {
          joystreamContentId
        }
        mediaDataObject {
          joystreamContentId
        }
        mediaMetadata {
          pixelWidth
          pixelHeight
        }
      }
    }
    `

export const channelsQuery = (id: string) => gql`
{
  channels(where: { id_eq: ${id} }) {
    id
    title
    description
    avatarPhotoDataObject {
      joystreamContentId
    }
  }
}
`
