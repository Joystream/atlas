import styled from '@emotion/styled'
import React from 'react'

import { useVideos } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { VideoGallery } from '@/components'
import { readEnv } from '@/config/envs'
import { sizes } from '@/shared/theme'

const channelId = readEnv('OFFICIAL_JOYSTREAM_CHANNEL')
const MAX_VIDEOS = 10

export const OfficialJoystreamUpdate = () => {
  const { videos, loading } = useVideos({
    where: {
      channelId_eq: channelId,
    },
    orderBy: VideoOrderByInput.CreatedAtDesc,
    limit: MAX_VIDEOS,
  })

  return (
    <Wrapper>
      <VideoGallery
        title="Official Joystream updates"
        videos={videos || []}
        seeAllUrl={`/channel/${channelId}`}
        loading={loading}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: ${sizes(18)};
`
