import styled from '@emotion/styled'
import React from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { PromisingNewChannels } from '@/components/PromisingNewChannels'
import { ViewWrapper } from '@/components/ViewWrapper'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components/CallToActionButton'
import { Text } from '@/shared/components/Text'
import { SvgNavChannels, SvgNavHome, SvgNavPopular } from '@/shared/icons'
import { sizes } from '@/shared/theme'

export const NewView: React.FC = () => (
  <StyledViewWrapper>
    <Header variant="h2">New & Noteworthy</Header>
    <InfiniteVideoGrid title="Videos worth watching" isFeatured onDemand titleLoader />
    <PromisingNewChannels />
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

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
