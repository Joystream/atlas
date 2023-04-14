import { FC } from 'react'

import { useTop10VideosThisMonth, useTop10VideosThisWeek } from '@/api/hooks/video'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { publicChannelFilter, publicVideoFilter } from '@/config/contentFilter'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SentryLogger } from '@/utils/logs'

type TopTenVideosProps = {
  period: 'week' | 'month'
}

export const TopTenVideos: FC<TopTenVideosProps> = ({ period }) => {
  const smMatch = useMediaMatch('sm')
  const queryFn = period === 'week' ? useTop10VideosThisWeek : useTop10VideosThisMonth
  const { videos, loading } = queryFn(
    {
      where: {
        ...publicVideoFilter,
        channel: publicChannelFilter,
      },
    },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos', 'TopTenVideos', error) }
  )

  return (
    <section>
      <VideoGallery title={`Top 10 this ${period}`} videos={videos} loading={loading} hasRanking={smMatch} />
    </section>
  )
}
