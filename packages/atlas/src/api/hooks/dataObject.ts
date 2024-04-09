import { QueryHookOptions } from '@apollo/client'
import { useCallback } from 'react'

import {
  GetDataObjectAvailabilityQuery,
  useGetDataObjectAvailabilityLazyQuery,
} from '@/api/queries/__generated__/dataObject.generated'

export const useDataObjectsAvailabilityLazy = (opts?: QueryHookOptions<GetDataObjectAvailabilityQuery>) => {
  const [getDataObjectsAvailability, { data, ...rest }] = useGetDataObjectAvailabilityLazyQuery(opts)

  const _getDataObjectsAvailability = useCallback(
    (ids: string[]) => {
      return getDataObjectsAvailability({
        variables: {
          id_in: ids,
        },
      })
    },
    [getDataObjectsAvailability]
  )

  return {
    getDataObjectsAvailability: _getDataObjectsAvailability,
    dataObjects: data?.storageDataObjects,
    ...rest,
  }
}
