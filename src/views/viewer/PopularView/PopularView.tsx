import React, { FC } from 'react'

import { ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavNew } from '@/shared/icons'

export const PopularView: FC = () => (
  <ViewWrapper>
    Popular
    <CallToActionWrapper>
      <CallToActionButton
        label="New & Noteworthy"
        to={absoluteRoutes.viewer.new()}
        colorVariant="green"
        icon={<SvgNavNew />}
      />
      <CallToActionButton label="Home" to={absoluteRoutes.viewer.index()} colorVariant="yellow" icon={<SvgNavHome />} />
      <CallToActionButton
        label="Browse channels"
        to={absoluteRoutes.viewer.channels()}
        colorVariant="blue"
        icon={<SvgNavChannels />}
      />
    </CallToActionWrapper>
  </ViewWrapper>
)
