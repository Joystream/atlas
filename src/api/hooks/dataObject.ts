import { QueryHookOptions } from '@apollo/client'
import { useCallback } from 'react'

import { GetDataObjectAvailabilityQuery, useGetDataObjectAvailabilityLazyQuery } from '@/api/queries'

export const useDataObjectsAvailabilityLazy = (opts?: QueryHookOptions<GetDataObjectAvailabilityQuery>) => {
  const [getDataObjectsAvailability, { data, ...rest }] = useGetDataObjectAvailabilityLazyQuery(opts)

  const _getDataObjectsAvailability = useCallback(
    (ids: string[]) => {
      getDataObjectsAvailability({
        variables: {
          joystreamContentIdIn: ids,
        },
      })
    },
    [getDataObjectsAvailability]
  )

  return {
    getDataObjectsAvailability: _getDataObjectsAvailability,
    dataObjects: data?.dataObjects,
    ...rest,
  }
}
