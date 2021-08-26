import { QueryHookOptions } from '@apollo/client'

import { GetDataObjectAvailabilityQuery, useGetDataObjectAvailabilityLazyQuery } from '@/api/queries'

type DataObjectOpts = QueryHookOptions<GetDataObjectAvailabilityQuery>
export const useDataObjectAvailabilityLazy = (opts?: DataObjectOpts) => {
  const [getDataObjectAvailability, { data, ...rest }] = useGetDataObjectAvailabilityLazyQuery(opts)

  return {
    getDataObjectAvailability: (contentId: string) =>
      getDataObjectAvailability({
        variables: {
          joystreamContentIdEq: contentId,
        },
      }),
    dataObjectAvailability: data?.dataObjects.length ? data.dataObjects[0].liaisonJudgement : undefined,
    ...rest,
  }
}
