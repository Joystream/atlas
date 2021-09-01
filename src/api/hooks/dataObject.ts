import { QueryHookOptions } from '@apollo/client'
import { useCallback } from 'react'

import { GetDataObjectAvailabilityQuery, useGetDataObjectAvailabilityLazyQuery } from '@/api/queries'

type DataObjectOpts = QueryHookOptions<GetDataObjectAvailabilityQuery>
export const useDataObjectsAvailabilityLazy = (opts?: DataObjectOpts) => {
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
