import React, { FC } from 'react'

import { ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavPopular } from '@/shared/icons'

export const NewView: FC = () => (
  <ViewWrapper>
    New & Noteworthy
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
  </ViewWrapper>
)
