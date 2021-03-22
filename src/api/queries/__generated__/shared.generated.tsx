import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
export type AssetDataObjectFieldsFragment = {
  __typename?: 'AssetDataObject'
  id: string
  createdAt: Date
  size: number
  liaisonId: number
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
}

export type BlockFieldsFragment = { __typename?: 'Block'; id: string; block: number }

export type AssetUploadStatusFieldsFragment = {
  __typename?: 'AssetStorage'
  uploadStatus:
    | {
        __typename?: 'AssetNeverProvided'
        dataObject: { __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment
        oldDataObject?: Types.Maybe<{ __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment>
        happenedIn: { __typename?: 'Block' } & BlockFieldsFragment
      }
    | {
        __typename?: 'AssetDeleted'
        dataObject: { __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment
        oldDataObject?: Types.Maybe<{ __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment>
        happenedIn: { __typename?: 'Block' } & BlockFieldsFragment
      }
    | {
        __typename?: 'AssetUploadStatus'
        dataObject: { __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment
        oldDataObject?: Types.Maybe<{ __typename?: 'AssetDataObject' } & AssetDataObjectFieldsFragment>
        happenedIn: { __typename?: 'Block' } & BlockFieldsFragment
      }
}

export const AssetDataObjectFieldsFragmentDoc = gql`
  fragment AssetDataObjectFields on AssetDataObject {
    id
    createdAt
    size
    liaisonId
    liaisonJudgement
    ipfsContentId
    joystreamContentId
  }
`
export const BlockFieldsFragmentDoc = gql`
  fragment BlockFields on Block {
    id
    block
  }
`
export const AssetUploadStatusFieldsFragmentDoc = gql`
  fragment AssetUploadStatusFields on AssetStorage {
    uploadStatus {
      ... on AssetNeverProvided {
        dataObject {
          ...AssetDataObjectFields
        }
        oldDataObject {
          ...AssetDataObjectFields
        }
        happenedIn {
          ...BlockFields
        }
      }
      ... on AssetDeleted {
        dataObject {
          ...AssetDataObjectFields
        }
        oldDataObject {
          ...AssetDataObjectFields
        }
        happenedIn {
          ...BlockFields
        }
      }
      ... on AssetUploadStatus {
        dataObject {
          ...AssetDataObjectFields
        }
        oldDataObject {
          ...AssetDataObjectFields
        }
        happenedIn {
          ...BlockFields
        }
      }
    }
  }
  ${AssetDataObjectFieldsFragmentDoc}
  ${BlockFieldsFragmentDoc}
`
