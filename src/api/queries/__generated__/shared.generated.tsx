import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
export type DataObjectFieldsFragment = {
  __typename?: 'DataObject'
  id: string
  createdAt: Date
  size: number
  liaisonId: number
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
}

export type BlockFieldsFragment = { __typename?: 'Block'; id: string; block: number }

export const DataObjectFieldsFragmentDoc = gql`
  fragment DataObjectFields on DataObject {
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
