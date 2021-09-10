import { filterAndSortGenericData } from './filtering'

import { MockVideo } from '../data/mockVideos'
import { CountData, FilteringArgs, GenericData } from '../types'

type CursorPaginatedData<TData = GenericData> = {
  edges: {
    cursor: string
    node: TData
  }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor?: string | null
  }
  totalCount: number
}
export type CursorPaginatedDataArgs = {
  first?: number | null
  after?: string | null
}

type OffsetLimitPaginatedDataArgs = {
  offset?: number | null
  limit?: number | null
}

const indexToCursor = (idx: number): string => btoa(idx.toString())
const cursorToIndex = (cursor: string): number => +atob(cursor)

export const createCursorPaginationAccessor =
  <TQuery extends CursorPaginatedData>(data: TQuery['edges'][0]['node'][]) =>
  (variables: CursorPaginatedDataArgs & FilteringArgs): CursorPaginatedData<TQuery['edges'][0]['node']> => {
    const filteredData = filterAndSortGenericData(data, variables)

    const { first: rawFirst, after: rawAfter } = variables

    const first = rawFirst ?? 0
    const afterIdx = rawAfter ? cursorToIndex(rawAfter) : -1

    const dataSliceStart = afterIdx + 1
    const dataSliceEnd = dataSliceStart + first

    const slicedData = filteredData.slice(dataSliceStart, dataSliceEnd)

    return {
      totalCount: filteredData.length,
      pageInfo: {
        hasNextPage: dataSliceEnd < filteredData.length - 1,
        endCursor: indexToCursor(dataSliceEnd - 1),
      },
      edges: slicedData.map((d, idx) => ({
        cursor: indexToCursor(dataSliceStart + idx),
        node: d,
      })),
    }
  }

export const createOffsetLimitPaginationAccessor =
  <TData extends GenericData>(data: TData[]) =>
  (variables: OffsetLimitPaginatedDataArgs & FilteringArgs): TData[] => {
    const filteredData = filterAndSortGenericData<TData>(data, variables)

    const { limit: rawLimit, offset: rawOffset } = variables
    const limit = rawLimit ?? 50
    const offset = rawOffset ?? 0

    return filteredData.slice(offset, offset + limit)
  }

export const createTotalCountAccessor =
  (data: MockVideo[]) =>
  (variables: FilteringArgs): CountData => {
    const filteredData = filterAndSortGenericData(data, variables)

    return {
      totalCount: filteredData.length,
    }
  }
