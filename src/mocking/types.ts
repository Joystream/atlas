import { graphql } from 'msw'
import {
  AllChannelFieldsFragment,
  VideoFieldsFragment,
  VideoWhereInput,
  VideoWhereUniqueInput,
  MembershipWhereInput,
} from '@/api/queries'

export type FilteringArgs<TWhere = VideoWhereInput | VideoWhereUniqueInput | MembershipWhereInput> = {
  where?: TWhere | null
}
export type SortingArgs = {
  orderBy?: string
}
export type GenericData = Record<string, unknown>
export type CountData = {
  totalCount: number
}
export type PredicateFn = (d: GenericData) => boolean
export type VideosChannelsData = {
  videos: VideoFieldsFragment[]
  channels: AllChannelFieldsFragment[]
}
export type HasId = {
  id: string
}
export type MocksStore = {
  videoViews: Record<string, number>
  channelFollows: Record<string, number>
}
export type Link = ReturnType<typeof graphql.link>
export type BaseDataQuery<TQueryData = unknown> = {
  [p: string]: TQueryData
}
export type DataAccessor<TQuery extends BaseDataQuery, TVariables> = (
  variables: TVariables
) => TQuery[keyof Omit<TQuery, '__typename'>]
export type DataMutator<TQuery extends BaseDataQuery, TVariables> = (variables: TVariables) => TQuery
