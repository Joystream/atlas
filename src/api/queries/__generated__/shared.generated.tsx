import * as Types from './baseTypes.generated'

import { BasicWorkerFieldsFragment, BasicWorkerFieldsFragmentDoc } from './workers.generated'
import { gql } from '@apollo/client'

export type DataObjectFieldsFragment = {
  __typename?: 'DataObject'
  id: string
  createdAt: Date
  size: number
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
  liaison?: Types.Maybe<{ __typename?: 'Worker' } & BasicWorkerFieldsFragment>
}

export const DataObjectFieldsFragmentDoc = gql`
  fragment DataObjectFields on DataObject {
    id
    createdAt
    size
    liaison {
      ...BasicWorkerFields
    }
    liaisonJudgement
    ipfsContentId
    joystreamContentId
  }
  ${BasicWorkerFieldsFragmentDoc}
`
