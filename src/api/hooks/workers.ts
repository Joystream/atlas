import { getRandomIntInclusive } from '@/utils/number'
import { QueryHookOptions } from '@apollo/client'
import {
  GetWorkerQuery,
  GetWorkersQuery,
  GetWorkersQueryVariables,
  useGetWorkerQuery,
  useGetWorkersQuery,
} from '@/api/queries/__generated__/workers.generated'
import { WorkerType } from '@/api/queries'

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
export const useStorageProviders = (variables: GetWorkersQueryVariables, opts?: WorkersOpts) => {
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

export const useRandomStorageProviderUrl = () => {
  const { storageProviders, loading } = useStorageProviders({ limit: 100 }, { fetchPolicy: 'network-only' })
  if (storageProviders?.length && !loading) {
    const randomStorageIdx = getRandomIntInclusive(0, storageProviders.length - 1)
    return storageProviders[randomStorageIdx].metadata
  }
}
