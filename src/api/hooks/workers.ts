import { QueryHookOptions } from '@apollo/client'

import {
  GetWorkerQuery,
  GetWorkerQueryVariables,
  GetWorkersQuery,
  GetWorkersQueryVariables,
  WorkerType,
  useGetWorkerQuery,
  useGetWorkersQuery,
} from '@/api/queries'

export const useWorker = (id: string, opts?: QueryHookOptions<GetWorkerQuery, GetWorkerQueryVariables>) => {
  const { data, ...queryRest } = useGetWorkerQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    storageProvider: data?.workerByUniqueInput,
    ...queryRest,
  }
}

export const storageWorkersVariables: GetWorkersQueryVariables = {
  where: {
    metadata_contains: 'http',
    isActive_eq: true,
    type_eq: WorkerType.Storage,
  },
}
export const useStorageWorkers = (
  variables: GetWorkersQueryVariables,
  opts?: QueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>
) => {
  const { data, loading, ...rest } = useGetWorkersQuery({
    ...opts,
    variables: {
      ...storageWorkersVariables,
      ...variables,
      where: {
        ...storageWorkersVariables.where,
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
