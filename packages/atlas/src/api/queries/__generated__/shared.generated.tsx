import { gql } from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicWorkerFieldsFragmentDoc } from './workers.generated'

export type DataObjectFieldsFragment = {
  __typename?: 'DataObject'
  id: string
  createdAt: Date
  size: number
  liaisonJudgement: Types.LiaisonJudgement
  ipfsContentId: string
  joystreamContentId: string
  liaison?: Types.Maybe<{
    __typename?: 'Worker'
    id: string
    workerId: string
    metadata?: Types.Maybe<string>
    isActive: boolean
    type: Types.WorkerType
  }>
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
