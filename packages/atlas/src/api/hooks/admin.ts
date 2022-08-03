import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  GetKillSwitchQuery,
  GetKillSwitchQueryVariables,
  SetKillSwitchMutation,
  SetKillSwitchMutationVariables,
  useGetKillSwitchQuery,
  useSetKillSwitchMutation,
} from '@/api/queries'
import { useAdminStore } from '@/providers/admin'

export const useSetKillSwitch = (opts?: MutationHookOptions<SetKillSwitchMutation, SetKillSwitchMutationVariables>) => {
  const [setKillSwitch, rest] = useSetKillSwitchMutation()
  return {
    setKillSwitch: (isKilled: boolean, secret: string) =>
      setKillSwitch({
        variables: { isKilled },
        context: { headers: { authorization: secret }, ...opts },
      }),
    ...rest,
  }
}

export const useGetKillSwitch = (opts?: QueryHookOptions<GetKillSwitchQuery, GetKillSwitchQueryVariables>) => {
  const {
    wasKilledLastTime,
    actions: { setWasKilledLastTime },
  } = useAdminStore()
  const { data, ...rest } = useGetKillSwitchQuery(opts)

  if (data?.admin.isKilled !== undefined) {
    setWasKilledLastTime(data?.admin.isKilled)
  }

  return {
    isKilled: data?.admin.isKilled,
    wasKilledLastTime,
    ...rest,
  }
}
