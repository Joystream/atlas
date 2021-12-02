import styled from '@emotion/styled'
import React, { useMemo } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import {
  CallToActionButton,
  CallToActionButtonProps,
  CallToActionWrapper,
} from '@/components/_buttons/CallToActionButton'
import { SvgSidebarChannels, SvgSidebarHome, SvgSidebarNew, SvgSidebarPopular } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { cVar, media, sizes } from '@/styles'
import { CtaData } from '@/types/cta'

type VideoContentTemplateProps = {
  title?: string
  cta?: CtaData[]
}

const CTA_MAP: Record<string, CallToActionButtonProps> = {
  home: {
    label: 'Home',
    to: absoluteRoutes.viewer.index(),
    colorVariant: 'yellow',
    icon: <SvgSidebarHome />,
  },
  new: {
    label: 'New & Noteworthy',
    to: absoluteRoutes.viewer.new(),
    colorVariant: 'green',
    icon: <SvgSidebarNew />,
  },
  channels: {
    label: 'Browse channels',
    to: absoluteRoutes.viewer.channels(),
    colorVariant: 'blue',
    icon: <SvgSidebarChannels />,
  },
  popular: {
    label: 'Popular on Joystream',
    to: absoluteRoutes.viewer.popular(),
    colorVariant: 'red',
    icon: <SvgSidebarPopular />,
  },
}

export const VideoContentTemplate: React.FC<VideoContentTemplateProps> = ({ children, title, cta }) => {
  const ctaContent = useMemo(
    () =>
      cta &&
      cta.map((item, idx) => (
        <CallToActionButton
          key={`cta-${idx}`}
          label={CTA_MAP[item].label}
          to={CTA_MAP[item].to}
          colorVariant={CTA_MAP[item].colorVariant}
          icon={CTA_MAP[item].icon}
        />
      )),
    [cta]
  )

  return (
    <StyledViewWrapper big>
      {title && <Header variant="h600">{title}</Header>}
      {children}
      {cta && <CallToActionWrapper>{ctaContent}</CallToActionWrapper>}
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
  font: ${cVar('typographyDesktopH600')};
  letter-spacing: ${cVar('typographyDesktopH600LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH600TextTransform')};

  ${media.lg} {
    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
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
