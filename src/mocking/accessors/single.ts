import { VideoWhereUniqueInput } from '@/api/queries'
import { FilteringArgs, HasId } from '../types'

export const createSingleItemAccessor = <TData extends HasId>(data: TData[]) => (
  variables: FilteringArgs<VideoWhereUniqueInput>
): TData | null => {
  return data.find((d) => d.id === variables.where?.id) ?? null
}
