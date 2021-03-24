import { VideoWhereUniqueInput, MembershipWhereUniqueInput } from '@/api/queries'
import { FilteringArgs, HasId, HasControllerAccount } from '../types'

export const createSingleItemAccessor = <TData extends HasId>(data: TData[]) => (
  variables: FilteringArgs<VideoWhereUniqueInput>
): TData | null => {
  return data.find((d) => d.id === variables.where?.id) ?? null
}
