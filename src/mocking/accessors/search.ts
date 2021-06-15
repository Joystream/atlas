import { VideosChannelsData } from '../types'

type SearchArgs = {
  text: string
}

export const createSearchAccessor = ({ videos, channels }: VideosChannelsData) => (variables: SearchArgs) => {
  const { text: queryText } = variables
  const matchString = (s: string) => s.includes(queryText) || queryText.includes(s)

  const matchedVideos = videos.filter(
    (v) => (v.title && matchString(v.title)) || (v.description && matchString(v.description))
  )
  const matchedChannels = channels.filter((c) => c.title && matchString(c.title))

  const matchedItems = [...matchedVideos, ...matchedChannels]
  return matchedItems.map((i) => ({
    item: i,
  }))
}
