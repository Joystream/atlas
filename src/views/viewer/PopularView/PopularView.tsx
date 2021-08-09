import styled from '@emotion/styled'
import React, { FC } from 'react'

import { useMostViewedVideos } from '@/api/hooks'
import { VideoGallery, ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper, Text } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavNew } from '@/shared/icons'
import { sizes } from '@/shared/theme'

export const PopularView: FC = () => {
  const { videos, loading } = useMostViewedVideos({ viewedWithinDays: 30, limit: 10 })
  return (
    <ViewWrapper>
      <Header variant="h2">Popular</Header>
      <VideoGallery hasRanking title="Top 10 this month" videos={videos || []} loading={loading} />
      <CallToActionWrapper>
        <CallToActionButton
          label="New & Noteworthy"
          to={absoluteRoutes.viewer.new()}
          colorVariant="green"
          icon={<SvgNavNew />}
        />
        <CallToActionButton
          label="Home"
          to={absoluteRoutes.viewer.index()}
          colorVariant="yellow"
          icon={<SvgNavHome />}
        />
        <CallToActionButton
          label="Browse channels"
          to={absoluteRoutes.viewer.channels()}
          colorVariant="blue"
          icon={<SvgNavChannels />}
        />
      </CallToActionWrapper>
    </ViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`
