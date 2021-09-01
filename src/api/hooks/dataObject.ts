import { QueryHookOptions } from '@apollo/client'
import { useCallback } from 'react'

import { GetDataObjectAvailabilityQuery, useGetDataObjectAvailabilityLazyQuery } from '@/api/queries'

type DataObjectOpts = QueryHookOptions<GetDataObjectAvailabilityQuery>
export const useDataObjectAvailabilityLazy = (opts?: DataObjectOpts) => {
  const [getDataObjectAvailability, { data, ...rest }] = useGetDataObjectAvailabilityLazyQuery(opts)

  const _getDataObjectAvailability = useCallback(
    (contentId) => {
      getDataObjectAvailability({
        variables: {
          joystreamContentIdEq: contentId,
        },
      })
    },
    [getDataObjectAvailability]
  )

  return {
    getDataObjectAvailability: _getDataObjectAvailability,
    dataObjectAvailability: data?.dataObjects.length ? data.dataObjects[0].liaisonJudgement : undefined,
    ...rest,
  }
}
