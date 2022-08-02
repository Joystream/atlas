import { MutationHookOptions, QueryHookOptions } from '@apollo/client'

import {
  GetKillSwitchQuery,
  GetKillSwitchQueryVariables,
  SetKillSwitchMutation,
  SetKillSwitchMutationVariables,
  useGetKillSwitchQuery,
  useSetKillSwitchMutation,
} from '@/api/queries'

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
  const { data, ...rest } = useGetKillSwitchQuery(opts)
  return {
    isKilled: data?.killSwitch.isKilled,
    ...rest,
  }
}
