import styled from '@emotion/styled'
import React from 'react'

import { CallToActionButton, CallToActionButtonProps, CallToActionWrapper } from '@/components/CallToActionButton'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { SvgNavChannels, SvgNavHome, SvgNavNew, SvgNavPopular } from '@/icons'
import { media, sizes, typography } from '@/theme'

type CtaData = 'home' | 'new' | 'channels' | 'popular'

type VideoContentTemplateProps = {
  title?: string
  cta?: CtaData[]
}

const CTA_MAP: Record<string, CallToActionButtonProps> = {
  home: {
    label: 'Home',
    to: absoluteRoutes.viewer.index(),
    colorVariant: 'yellow',
    icon: <SvgNavHome />,
  },
  new: {
    label: 'New & Noteworthy',
    to: absoluteRoutes.viewer.new(),
    colorVariant: 'green',
    icon: <SvgNavNew />,
  },
  channels: {
    label: 'Browse channels',
    to: absoluteRoutes.viewer.channels(),
    colorVariant: 'blue',
    icon: <SvgNavChannels />,
  },
  popular: {
    label: 'Popular on Joystream',
    to: absoluteRoutes.viewer.popular(),
    colorVariant: 'red',
    icon: <SvgNavPopular />,
  },
}

export const VideoContentTemplate: React.FC<VideoContentTemplateProps> = ({ children, title, cta }) => {
  const ctaContent =
    cta &&
    cta.map((item, idx) => (
      <CallToActionButton
        key={`cta-${idx}`}
        label={CTA_MAP[item].label}
        to={CTA_MAP[item].to}
        colorVariant={CTA_MAP[item].colorVariant}
        icon={CTA_MAP[item].icon}
      />
    ))

  return (
    <StyledViewWrapper big>
      {title && <Header variant="h3">{title}</Header>}
      {children}
      {cta && <CallToActionWrapper>{ctaContent}</CallToActionWrapper>}
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
  font-size: ${typography.sizes.h3};

  ${media.lg} {
    font-size: ${typography.sizes.h2};
    line-height: ${typography.lineHeights.h2};
  }
`

const StyledViewWrapper = styled(LimitedWidthContainer)`
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
