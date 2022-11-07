import { QueryHookOptions } from '@apollo/client'

import {
  GetVideoHeroQuery,
  GetVideoHeroQueryVariables,
  useGetVideoHeroQuery,
} from '@/api/queries/__generated__/featured.generated'
import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SentryLogger } from '@/utils/logs'

export type VideoHeroData = {
  video?: BasicVideoFieldsFragment | null
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
