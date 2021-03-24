import { MembershipWhereInput } from '@/api/queries'
import { FilteringArgs, HasControllerAccount } from '../types'

export const createMembershipsAccessor = <TData extends HasControllerAccount>(data: TData[]) => (
  variables: FilteringArgs<MembershipWhereInput>
): TData[] => {
  return data.filter((d) => d.controllerAccount === variables.where?.controllerAccount_eq)
}
