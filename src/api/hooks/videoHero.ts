import { QueryHookOptions } from '@apollo/client'

import {
  GetVideoHeroQuery,
  GetVideoHeroQueryVariables,
  useGetVideoHeroQuery,
} from '@/api/queries/__generated__/featured.generated'
import { SentryLogger } from '@/utils/logs'

import { VideoFieldsFragment } from '../queries'

export type VideoHeroData = {
  video?: VideoFieldsFragment | null
  heroTitle: string
  heroVideoCutUrl: string
  heroPosterUrl: string | null
}

export const useVideoHeroData = (opts?: QueryHookOptions<GetVideoHeroQuery, GetVideoHeroQueryVariables>) => {
  const { data, ...queryRest } = useGetVideoHeroQuery({
    ...opts,
    onError: (error) => SentryLogger.error('Failed to fetch video hero', 'VideoHero', error),
  })

  return {
    videoHero: data?.videoHero,
    ...queryRest,
  }
}
