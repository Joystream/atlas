import { QueryHookOptions } from '@apollo/client'

import { WorkerType } from '@/api/queries'
import {
  GetWorkerQuery,
  GetWorkersQuery,
  GetWorkersQueryVariables,
  useGetWorkerQuery,
  useGetWorkersQuery,
} from '@/api/queries/__generated__/workers.generated'

type WorkerOpts = QueryHookOptions<GetWorkerQuery>
export const useWorker = (id: string, opts?: WorkerOpts) => {
  const { data, ...queryRest } = useGetWorkerQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    storageProvider: data?.workerByUniqueInput,
    ...queryRest,
  }
}

type WorkersOpts = QueryHookOptions<GetWorkersQuery>
export const useStorageWorkers = (variables: GetWorkersQueryVariables, opts?: WorkersOpts) => {
  const { data, loading, ...rest } = useGetWorkersQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        metadata_contains: 'http',
        isActive_eq: true,
        type_eq: WorkerType.Storage,
        ...variables.where,
      },
    },
  })
  return {
    storageProviders: data?.workers,
    loading,
    ...rest,
  }
}
