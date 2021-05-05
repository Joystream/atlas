import { getRandomIntInclusive } from '@/utils/number'
import { QueryHookOptions } from '@apollo/client'
import {
  GetStorageProviderQuery,
  GetStorageProvidersQuery,
  GetStorageProvidersQueryVariables,
  useGetStorageProviderQuery,
  useGetStorageProvidersQuery,
} from '@/api/queries/__generated__/storageProviders.generated'

type StorageProviderOpts = QueryHookOptions<GetStorageProviderQuery>
export const useStorageProvider = (id: string, opts?: StorageProviderOpts) => {
  const { data, ...queryRest } = useGetStorageProviderQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    storageProvider: data?.workerByUniqueInput,
    ...queryRest,
  }
}

type StorageProvidersOpts = QueryHookOptions<GetStorageProvidersQuery>
export const useStorageProviders = (variables: GetStorageProvidersQueryVariables, opts?: StorageProvidersOpts) => {
  const { data, loading, ...rest } = useGetStorageProvidersQuery({ ...opts, variables })
  return {
    storageProviders: data?.workers,
    loading,
    ...rest,
  }
}

export const useRandomStorageProviderUrl = () => {
  const { storageProviders, loading } = useStorageProviders(
    {
      where: { metadata_contains: 'http', isActive_eq: true },
      limit: 100,
    },
    {
      fetchPolicy: 'network-only',
    }
  )
  if (storageProviders?.length && !loading) {
    const randomStorageIdx = getRandomIntInclusive(0, storageProviders.length - 1)
    return storageProviders[randomStorageIdx].metadata
  }
}
