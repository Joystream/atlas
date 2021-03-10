import { GenericData, VideosChannelsData } from '../types'

type SearchArgs = {
  text: string
}

export const createSearchAccessor = <TData extends GenericData>({ videos, channels }: VideosChannelsData) => (
  variables: SearchArgs
) => {
  const { text: queryText } = variables
  const matchString = (s: string) => s.includes(queryText) || queryText.includes(s)

  const matchedVideos = videos.filter((v) => matchString(v.title) || matchString(v.description))
  const matchedChannels = channels.filter((c) => matchString(c.handle))

  const matchedItems = [...matchedVideos, ...matchedChannels]
  return matchedItems.map((i) => ({
    item: i,
  }))
}
