import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
export type DataObjectFieldsFragment = {
  __typename?: 'DataObject'
  id: string
  createdAt: Date
  size: number
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
  liaison?: Types.Maybe<{ __typename?: 'StorageProvider'; id: string; metadata?: Types.Maybe<string> }>
}

export const DataObjectFieldsFragmentDoc = gql`
  fragment DataObjectFields on DataObject {
    id
    createdAt
    size
    liaison {
      id
      metadata
    }
    liaisonJudgement
    ipfsContentId
    joystreamContentId
  }
`
