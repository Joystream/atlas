import { VideoQueryArgs } from './resolvers'
import { VideoFieldsFragment } from '@/api/queries/__generated__/videos.generated'
import { VideoEdge } from '@/api/queries/__generated__/baseTypes.generated'
import { Video } from '../../api/queries/__generated__/baseTypes.generated'
import { GetVideosQueryHookResult, GetVideosConnectionQuery } from '../../api/queries/__generated__/videos.generated'
import { GetVideosConnection } from '../../api/queries/__generated__/GetVideosConnection'

export const encode =
  typeof btoa !== 'undefined'
    ? btoa
    : typeof Buffer !== 'undefined'
    ? (str: string) => Buffer.from(str).toString('base64')
    : (str: string) => str

export const getIndexOfRecord = (records: VideoFieldsFragment[], cursor: string | null) => {
  let index = null

  if (cursor === null) return index

  for (let i = 0; i < records.length; i++) {
    if (encode(`${'VideoConnection'}:${records[i].id}`) === cursor) {
      index = i
      break
    }
  }

  return index
}

export const getEdges = (records: VideoFieldsFragment[], args: VideoQueryArgs) => {
  const { after, first } = args
  const afterIndex = getIndexOfRecord(records, after)

  if (afterIndex != null) records = records.slice(afterIndex + 1)
  if (first != null) records = records.slice(0, first)

  return records.map((record) => ({
    cursor: encode(`${'VideoConnection'}:${record.id}`),
    node: record,
    __typename: 'VideoEdge' as const,
  }))
}
export const getPageInfo = (
  records: VideoFieldsFragment[],
  edges: GetVideosConnectionQuery['videosConnection']['edges']
) => {
  const pageInfo = {
    hasPreviousPage: false,
    hasNextPage: false,
    startCursor: '',
    endCursor: '',
  }

  if (edges && edges.length) {
    const [firstEdge] = edges
    const lastEdge = edges[edges.length - 1]

    pageInfo.startCursor = firstEdge.cursor
    pageInfo.endCursor = lastEdge.cursor
    pageInfo.hasPreviousPage = firstEdge.node.id !== records[0].id
    pageInfo.hasNextPage = lastEdge.node.id !== records[records.length - 1].id
  }

  return pageInfo
}
