import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
export type DataObjectFieldsFragment = {
  __typename?: 'DataObject'
  id: string
  createdAt: Date
  size: number
  liaisonId?: Types.Maybe<number>
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
}

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
