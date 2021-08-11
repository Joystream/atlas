import styled from '@emotion/styled'
import React from 'react'

import { InfiniteVideoGrid, ViewWrapper } from '@/components'
import { PromisingNewChannels } from '@/components/PromisingNewChannels'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper, Text } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavPopular } from '@/shared/icons'
import { sizes } from '@/shared/theme'

export const NewView: React.FC = () => (
  <StyledViewWrapper>
    <Header variant="h2">New & Noteworthy</Header>
    <PromisingNewChannels />
    <StyledInfiniteVideoGrid title="Videos worth watching" isFeatured onDemand />
    <CallToActionWrapper>
      <CallToActionButton label="Home" to={absoluteRoutes.viewer.index()} colorVariant="yellow" icon={<SvgNavHome />} />
      <CallToActionButton
        label="Browse channels"
        to={absoluteRoutes.viewer.channels()}
        colorVariant="blue"
        icon={<SvgNavChannels />}
      />
      <CallToActionButton
        label="Popular on Joystream"
        to={absoluteRoutes.viewer.popular()}
        colorVariant="red"
        icon={<SvgNavPopular />}
      />
    </CallToActionWrapper>
  </StyledViewWrapper>
)

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`

const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  margin: 0;
  padding-bottom: 4rem;

  :not(:first-of-type) {
    margin-top: ${sizes(36)};
  }
`
const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(10)};
`
