import { getRandomIntInclusive } from '@/utils/number'
import { QueryHookOptions } from '@apollo/client'
import {
  GetStorageProviderQuery,
  GetStorageProvidersQuery,
  GetStorageProvidersQueryVariables,
  useGetStorageProviderQuery,
  useGetStorageProvidersQuery,
  useGetStorageProvidersCountQuery,
} from '../queries/__generated__/storageProviders.generated'

type StorageProviderOpts = QueryHookOptions<GetStorageProviderQuery>
export const useStorageProvider = (id: string, opts?: StorageProviderOpts) => {
  const { data, ...queryRest } = useGetStorageProviderQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    storageProvider: data?.storageProviderByUniqueInput,
    ...queryRest,
  }
}

type StorageProvidersOpts = QueryHookOptions<GetStorageProvidersQuery>
export const useStorageProviders = (variables: GetStorageProvidersQueryVariables, opts?: StorageProvidersOpts) => {
  const { data, loading, ...rest } = useGetStorageProvidersQuery({ ...opts, variables })
  return {
    storageProviders: data?.storageProviders,
    loading,
    ...rest,
  }
}

export const useStorageProvidersCount = (variables: GetStorageProvidersQueryVariables, opts?: StorageProvidersOpts) => {
  const { data: connectionData, loading, ...rest } = useGetStorageProvidersCountQuery({ ...opts, variables })
  return {
    totalCount: connectionData?.storageProvidersConnection.totalCount,
    loading,
    ...rest,
  }
}

export const useRandomStorageProviderUrl = () => {
  const { totalCount } = useStorageProvidersCount({ where: { metadata_contains: 'http' } })
  const randomStorageIdx = totalCount && getRandomIntInclusive(1, totalCount)

  const { storageProviders } = useStorageProviders(
    {
      where: { metadata_contains: ' ' },
      offset: randomStorageIdx,
      limit: 1,
    },
    { skip: randomStorageIdx === undefined }
  )
  if (storageProviders?.length) {
    return storageProviders[0].metadata
  }
}
